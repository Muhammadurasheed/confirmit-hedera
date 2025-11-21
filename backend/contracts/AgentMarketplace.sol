// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AgentMarketplace
 * @dev Decentralized marketplace for AI Agents to buy/sell fraud verification services
 * @notice This contract enables autonomous Agent-to-Agent (A2A) transactions on Hedera
 */
contract AgentMarketplace {
    
    // Agent Service Types
    enum ServiceType {
        VISION_ANALYSIS,      // Receipt image analysis
        FORENSIC_ANALYSIS,    // ELA, noise analysis
        METADATA_VALIDATION,  // Field consistency checks
        REPUTATION_LOOKUP,    // Fraud database queries
        REASONING_SYNTHESIS   // Final verdict generation
    }
    
    // Agent registration structure
    struct Agent {
        address agentAddress;
        string agentId;
        ServiceType serviceType;
        uint256 pricePerRequest;  // in tinybar (1 HBAR = 100M tinybar)
        uint256 totalRequests;
        uint256 successfulRequests;
        uint256 reputationScore;  // 0-1000
        bool isActive;
        uint256 registeredAt;
    }
    
    // Service request structure
    struct ServiceRequest {
        uint256 requestId;
        address requester;
        address provider;
        ServiceType serviceType;
        uint256 amount;
        string dataHash;  // IPFS hash of request data
        RequestStatus status;
        uint256 createdAt;
        uint256 completedAt;
    }
    
    enum RequestStatus {
        PENDING,
        ACCEPTED,
        COMPLETED,
        DISPUTED,
        REFUNDED
    }
    
    // State variables
    mapping(address => Agent) public agents;
    mapping(uint256 => ServiceRequest) public requests;
    mapping(ServiceType => address[]) public agentsByService;
    
    address[] public allAgents;
    uint256 public requestCounter;
    uint256 public platformFeePercent = 2; // 2% platform fee
    address public platformWallet;
    
    // Events
    event AgentRegistered(address indexed agentAddress, string agentId, ServiceType serviceType);
    event ServiceRequested(uint256 indexed requestId, address indexed requester, ServiceType serviceType);
    event ServiceCompleted(uint256 indexed requestId, address indexed provider, uint256 amount);
    event ReputationUpdated(address indexed agentAddress, uint256 newScore);
    event PaymentProcessed(uint256 indexed requestId, address indexed from, address indexed to, uint256 amount);
    
    constructor() {
        platformWallet = msg.sender;
    }
    
    /**
     * @dev Register a new AI agent in the marketplace
     */
    function registerAgent(
        string memory _agentId,
        ServiceType _serviceType,
        uint256 _pricePerRequest
    ) external {
        require(agents[msg.sender].agentAddress == address(0), "Agent already registered");
        require(_pricePerRequest > 0, "Price must be greater than 0");
        
        Agent memory newAgent = Agent({
            agentAddress: msg.sender,
            agentId: _agentId,
            serviceType: _serviceType,
            pricePerRequest: _pricePerRequest,
            totalRequests: 0,
            successfulRequests: 0,
            reputationScore: 500, // Start with neutral score
            isActive: true,
            registeredAt: block.timestamp
        });
        
        agents[msg.sender] = newAgent;
        allAgents.push(msg.sender);
        agentsByService[_serviceType].push(msg.sender);
        
        emit AgentRegistered(msg.sender, _agentId, _serviceType);
    }
    
    /**
     * @dev Request a service from an agent
     */
    function requestService(
        address _provider,
        ServiceType _serviceType,
        string memory _dataHash
    ) external payable returns (uint256) {
        Agent storage provider = agents[_provider];
        require(provider.isActive, "Provider not active");
        require(provider.serviceType == _serviceType, "Service type mismatch");
        require(msg.value >= provider.pricePerRequest, "Insufficient payment");
        
        requestCounter++;
        
        ServiceRequest memory newRequest = ServiceRequest({
            requestId: requestCounter,
            requester: msg.sender,
            provider: _provider,
            serviceType: _serviceType,
            amount: msg.value,
            dataHash: _dataHash,
            status: RequestStatus.PENDING,
            createdAt: block.timestamp,
            completedAt: 0
        });
        
        requests[requestCounter] = newRequest;
        provider.totalRequests++;
        
        emit ServiceRequested(requestCounter, msg.sender, _serviceType);
        
        return requestCounter;
    }
    
    /**
     * @dev Complete a service request and process payment
     */
    function completeService(uint256 _requestId, string memory _resultHash) external {
        ServiceRequest storage request = requests[_requestId];
        require(request.provider == msg.sender, "Only provider can complete");
        require(request.status == RequestStatus.PENDING, "Request not pending");
        
        request.status = RequestStatus.COMPLETED;
        request.completedAt = block.timestamp;
        
        // Calculate platform fee
        uint256 platformFee = (request.amount * platformFeePercent) / 100;
        uint256 providerAmount = request.amount - platformFee;
        
        // Transfer payment to provider
        payable(request.provider).transfer(providerAmount);
        payable(platformWallet).transfer(platformFee);
        
        // Update provider stats
        Agent storage provider = agents[request.provider];
        provider.successfulRequests++;
        
        // Update reputation (simple formula: success rate * 1000)
        provider.reputationScore = (provider.successfulRequests * 1000) / provider.totalRequests;
        
        emit ServiceCompleted(_requestId, request.provider, providerAmount);
        emit PaymentProcessed(_requestId, request.requester, request.provider, providerAmount);
        emit ReputationUpdated(request.provider, provider.reputationScore);
    }
    
    /**
     * @dev Get best agent for a service type (by reputation)
     */
    function getBestAgent(ServiceType _serviceType) external view returns (address) {
        address[] memory serviceAgents = agentsByService[_serviceType];
        require(serviceAgents.length > 0, "No agents for this service");
        
        address bestAgent = serviceAgents[0];
        uint256 highestScore = agents[bestAgent].reputationScore;
        
        for (uint256 i = 1; i < serviceAgents.length; i++) {
            Agent memory agent = agents[serviceAgents[i]];
            if (agent.isActive && agent.reputationScore > highestScore) {
                bestAgent = serviceAgents[i];
                highestScore = agent.reputationScore;
            }
        }
        
        return bestAgent;
    }
    
    /**
     * @dev Get agent statistics
     */
    function getAgentStats(address _agentAddress) external view returns (
        string memory agentId,
        uint256 totalRequests,
        uint256 successfulRequests,
        uint256 reputationScore,
        uint256 pricePerRequest
    ) {
        Agent memory agent = agents[_agentAddress];
        return (
            agent.agentId,
            agent.totalRequests,
            agent.successfulRequests,
            agent.reputationScore,
            agent.pricePerRequest
        );
    }
    
    /**
     * @dev Update agent pricing
     */
    function updatePrice(uint256 _newPrice) external {
        require(agents[msg.sender].isActive, "Agent not registered");
        require(_newPrice > 0, "Price must be greater than 0");
        
        agents[msg.sender].pricePerRequest = _newPrice;
    }
    
    /**
     * @dev Toggle agent active status
     */
    function toggleActiveStatus() external {
        require(agents[msg.sender].agentAddress != address(0), "Agent not registered");
        agents[msg.sender].isActive = !agents[msg.sender].isActive;
    }
    
    /**
     * @dev Get total number of agents
     */
    function getTotalAgents() external view returns (uint256) {
        return allAgents.length;
    }
    
    /**
     * @dev Get all agents for a service type
     */
    function getAgentsByService(ServiceType _serviceType) external view returns (address[] memory) {
        return agentsByService[_serviceType];
    }
}

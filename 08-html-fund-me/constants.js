export const CONTRACT_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
export const ABI = [
    {
        'inputs': [
            {
                'internalType': 'contract AggregatorV3Interface',
                'name': '_priceFeedAddress',
                'type': 'address'
            }
        ],
        'stateMutability': 'nonpayable',
        'type': 'constructor'
    },
    {
        'inputs': [],
        'name': 'FundMe__NotEnoughFund',
        'type': 'error'
    },
    {
        'inputs': [],
        'name': 'FundMe__NotOwner',
        'type': 'error'
    },
    {
        'inputs': [],
        'name': 'FundMe__TransferFailed',
        'type': 'error'
    },
    {
        'stateMutability': 'payable',
        'type': 'fallback'
    },
    {
        'inputs': [],
        'name': 'MINIMUM_USD',
        'outputs': [
            {
                'internalType': 'uint256',
                'name': '',
                'type': 'uint256'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [],
        'name': 'fund',
        'outputs': [],
        'stateMutability': 'payable',
        'type': 'function'
    },
    {
        'inputs': [
            {
                'internalType': 'address',
                'name': 'funder',
                'type': 'address'
            }
        ],
        'name': 'getAddressToAmountFunded',
        'outputs': [
            {
                'internalType': 'uint256',
                'name': '',
                'type': 'uint256'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [
            {
                'internalType': 'uint256',
                'name': 'index',
                'type': 'uint256'
            }
        ],
        'name': 'getFunder',
        'outputs': [
            {
                'internalType': 'address',
                'name': '',
                'type': 'address'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [],
        'name': 'getOwner',
        'outputs': [
            {
                'internalType': 'address',
                'name': '',
                'type': 'address'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [],
        'name': 'getPriceFeed',
        'outputs': [
            {
                'internalType': 'address',
                'name': '',
                'type': 'address'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [],
        'name': 'withdraw',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'stateMutability': 'payable',
        'type': 'receive'
    }
];
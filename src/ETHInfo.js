import CurrencyInfo from './CurrencyInfo';

class ETHInfo extends CurrencyInfo {
    get shortName() {
        return 'ETH';
    }

    get fullName() {
        return 'Ether';
    }

    getTransactionURL(tx) {
        return 'https://etherscan.io/tx/0x' + tx;
    }

    get logoSVG() {
        return '<svg width="256" height="417" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid"><path fill="#343434" d="M128 0l-3 10v275l3 3 128-76"/><path fill="#8C8C8C" d="M128 0L0 212l128 76V154"/><path fill="#3C3C3B" d="M128 312l-2 2v98l2 5 128-180"/><path fill="#8C8C8C" d="M128 417V312L0 237"/><path fill="#141414" d="M128 288l128-76-128-58"/><path fill="#393939" d="M0 212l128 76V154"/></svg>';
    }
}

export default ETHInfo;

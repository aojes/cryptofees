import React, { Component } from 'react';
import Transaction from './Transaction';

/* global _ */

class FeeVisualizer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            price: ''
        };
    }

    renderTransaction = (tx) => (<Transaction key={tx.id} id={tx.id} url={this.props.provider.getTransactionURL(tx.id)} amount={tx.amount} fee={tx.fee} amountUSD={tx.amountUSD} feeUSD={tx.feeUSD} percentage={tx.percentage} />);

    componentDidMount() {
        this.setState({ price: '' });
        this.props.provider.initialize();
        this.props.provider.getData((data) => {
            this.setState({
                price: data.price.toFixed(1) + ' USD',
                allTransactions: data.transactions,
                lastUpdated: data.lastUpdated
            });

            this.retrieveTransactions(+this.props.minAmount, +this.props.maxAmount);
        },
        () => {
            this.setState({ error: true });
        });
    }

    retrieveTransactions(min, max) {
        let transactions = _.chain(this.state.allTransactions)
            .filter((tx) => { return tx.fee > 0 && tx.amountUSD >= min && tx.amountUSD <= max })
            // .take(30) // TODO configure this?
            .orderBy('percentage')
            .value();

        this.setState({
            error: undefined,
            price: this.state.price,
            allTransactions: this.state.allTransactions,
            transactions: transactions
        });
    }

    renderTransactions = () => {
        if(this.state.error) {
            return (<div className="text-danger">Error: cannot retrieve {this.props.provider.shortName} transactions.</div>);
        } else {
            if(this.state.transactions) {
                if(this.state.transactions.length) {
                    return (
                        <div>
                            <table className="table table-condensed">
                                <thead>
                                    <tr>
                                        <td>Amount, USD</td>
                                        <td>Fee, USD</td>
                                        <td>Fee Percentage</td>
                                        <td></td>
                                    </tr>
                                </thead>
                                <tbody>{this.state.transactions.map(this.renderTransaction)}</tbody>
                            </table>
                        </div>
                    );
                } else {
                    return null;
                }
            } else {
                return (<p>Retrieving latest transactions...</p>);
            }
        }
    }

    renderAverageValues = () => {
        if(this.state.transactions) {
            if(this.state.transactions.length) {
                let average = {
                    percentage: _.meanBy(this.state.transactions, 'percentage').toFixed(4),
                    feeUSD: _.meanBy(this.state.transactions, 'feeUSD').toFixed(4)
                };
                let min = _.minBy(this.state.transactions, 'percentage'),
                    max = _.maxBy(this.state.transactions, 'percentage'),
                    // medianFee = (this.state.transactions[(this.state.transactions.length - 1) >> 1]['feeUSD'] + this.state.transactions[this.state.transactions.length >> 1]['feeUSD']) / 2,
                    medianPercentage = (this.state.transactions[(this.state.transactions.length - 1) >> 1]['percentage'] + this.state.transactions[this.state.transactions.length >> 1]['percentage']) / 2;

                return (
                    <div>
                        <p>
                            <b>Average <span className="hidden-xs">transaction</span> fee is {average.percentage}%,
                            median <span className="hidden-xs">fee</span> is {medianPercentage.toFixed(4)}%</b><br/>
                            Min fee is <span title={min.feeUSD.toFixed(2) + ' USD'}>{min.percentage.toFixed(4)}%</span> <a target="_blank" href={this.props.provider.getTransactionURL(min.id)} className="btn btn-link btn-xs">Transaction Details</a><br/>
                            Max fee is <span title={max.feeUSD.toFixed(2) + ' USD'}>{max.percentage.toFixed(4)}%</span> <a target="_blank" href={this.props.provider.getTransactionURL(max.id)} className="btn btn-link btn-xs">Transaction Details</a>
                        </p>
                        <p>Latest transactions with amount between {this.props.minAmount} and {this.props.maxAmount} USD:</p>
                    </div>
                );
            } else {
                return (
                    <p><i>No recent transactions with amount between {this.props.minAmount} and {this.props.maxAmount} USD found.</i></p>
                );
            }
        } else {
            return null;
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if(nextProps.minAmount !== this.props.minAmount || nextProps.maxAmount !== this.props.maxAmount) {
            this.retrieveTransactions(nextProps.minAmount, nextProps.maxAmount);
        }
    }

    render() {
        return (
            <div>
                <h2>
                    <img src={'img/' + this.props.provider.shortName.toLowerCase() + '.svg'} alt={this.props.provider.fullName} className="currency-logo" />
                    <b title={this.props.provider.fullName}>{this.props.provider.shortName}</b>
                    <span className="price pull-right" title={"Last updated: " + this.props.provider.lastUpdated}>{this.state.price}</span>
                </h2>
                {this.renderAverageValues()}
                <div className="transactionsList">
                    {this.renderTransactions()}
                </div>
            </div>
        );
    }
}

export default FeeVisualizer;

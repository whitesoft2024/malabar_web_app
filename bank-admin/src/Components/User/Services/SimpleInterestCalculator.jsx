import React, { useState } from 'react';

const SimpleInterestCalculator = () => {
    // State variables for duration, amount, and interest
    const [duration, setDuration] = useState(12);
    const [amount, setAmount] = useState(1000);
    const [interest, setInterest] = useState(1);

    // Function to update duration value
    const handleDurationChange = (event) => {
        setDuration(parseInt(event.target.value));
    };

    // Function to update amount value
    const handleAmountChange = (event) => {
        setAmount(parseInt(event.target.value));
    };

    // Function to update interest value
    const handleInterestChange = (event) => {
        setInterest(parseInt(event.target.value));
    };

    // Calculate interest amount
    const interestAmount = (amount * duration * interest) / 100;

    // Calculate final amount
    const finalAmount = amount + interestAmount;

    return (
        <div className="calculator-container">
            <div className="row my-2">
                <div className="col-auto mx-2">
                    <label className="text-uppercase">Duration <span className="text-danger">*</span></label>
                    <input type="range" className="form-range durationval" min="3" max="60" step="3" value={duration} id="durationval" onChange={handleDurationChange} />
                    <label className="text-primary durationrangeval">{duration} months</label>
                </div>
                <div className="col-auto mx-2">
                    <label className="text-uppercase">Amount <span className="text-danger">*</span></label>
                    <input type="range" className="form-range samount" min="1000" max="10000" step="1000" value={amount} id="samount" onChange={handleAmountChange} />
                    <label className="text-primary samount">{amount}</label>
                </div>
            </div>
            <div className="row my-2">
                <div className="col-auto mx-2">
                    <label className="text-uppercase">Interest <span className="text-danger">*</span></label>
                    <input type="range" className="form-range rangeSelector" min="1" max="10" value={interest} onChange={handleInterestChange} />
                    <label className="text-primary intpercent">{interest} %</label>
                </div>
                <div className="col-auto mx-2">
                    <label className="text-uppercase">Interest amount</label>
                    <input className="text-primary intamt form-control" readOnly value={interestAmount} />
                </div>
            </div>
            <div className="row my-2">
                <div className="col-auto mx-2">
                    <label className="text-uppercase">Final amount</label>
                    <input className="text-primary famt form-control" readOnly value={finalAmount} />
                </div>
            </div>
        </div>
    );
};

export default SimpleInterestCalculator;

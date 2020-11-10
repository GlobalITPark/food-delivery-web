import React, { Component } from "react"

class Summary extends Component {
    render() {
        const { cartItems } = this.props;
        return (
        <div className="row wrap-cart">
            <div className="col-md-8">
                <h4 className="mb-3">Thank you for your order!</h4>
                <p className="mb-3">Your order will be delivered to your doorstep within 1 day.</p>
            </div>
        </div>
        );
    }
}

export default Summary;

import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom'
import { removeFromCart } from "../actions/cartActions";

class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      address: "",
      showCheckout: false,
      subtotal: 0,
      tax: 0,
      total: 0,
    };

    this.removeItemfromCart = this.removeItemfromCart.bind(this);
  }

  componentWillMount() {
    const subtotal = this.props.cartItems.reduce((a, c) => a + c.price * c.count, 0);
    this.setState({
      subtotal:subtotal,
      total:subtotal
    })
  }

  removeItemfromCart(item){
    this.props.removeFromCart(item);
    const subtotal = this.state.subtotal - item.price*item.count;
    this.setState({
      subtotal:subtotal,
      total:subtotal
  })
  }

  render() {
    const { cartItems } = this.props;
    return (
      <div className="wrapper wrapper-full-page">
      <div className="full-page landing-page">
          <div className="content">
            <div  style={{paddingTop: '70px'}} className="wrap-cart">
            <div className="heading cf">
                <h1>My Cart</h1>
            </div>
              <div className="cart">
                <ul className="cartWrap">
                {cartItems.map((item) => (
                  <li className="items even" key={item.key}>      
                    <div className="infoWrap"> 
                      <div className="cartSection">
                      <img src={item.image} alt={item.title} className="itemImg" />
                        <p className="itemNumber">{item.key}</p>
                        <h3>{item.title}</h3>
                        <p>
                           {/* <input type="text"  className="qty" placeholder={item.count}/> */}
                           {item.count} x  ¥{item.price}
                        </p>
                        <p className="stockStatus"> In Stock</p>
                      </div>  
                  
                      
                      <div className="prodTotal cartSection">
                        <p>¥{item.count*item.price}</p>
                      </div>
                            <div className="cartSection removeWrap">
                        <a href="#" className="remove" onClick={() => this.removeItemfromCart(item)}>x</a>
                      </div>
                    </div>
                  </li>
                  ))}
                </ul>
              </div>
              {cartItems.length === 0 ? (
                <h5>Cart is empty</h5>
              ) : (
                <div className="subtotal cf">
                  <ul>
                    <li className="totalRow"><span className="checkout-label">Subtotal</span><span className="value">¥{ this.state.subtotal }</span></li>
                    <li className="totalRow"><span className="checkout-label">Tax</span><span className="value">¥{ this.state.tax }</span></li>
                    <li className="totalRow final"><span className="checkout-label">Total</span><span className="value">¥{this.state.total }</span></li>
                    <li className="totalRow"><Link to="/checkout" className="btn continue">Checkout</Link></li>
                  </ul>
                </div>
              )}
            </div>
        </div>       
      </div>
    </div>
    );
  }
}

export default connect(
  (state) => ({
    cartItems: state.cart.cartItems,
  }),
  {
    removeFromCart 
  }
)(Cart);

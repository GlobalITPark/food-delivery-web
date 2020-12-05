import React, {Component} from 'react'
import {connect} from 'react-redux'
import {addToCart} from '../actions/cartActions'
import {Cell,Card,CardTitle,CardText,CardActions,Button} from 'react-mdl';


class Item extends Component {

    render() {
        return (
            <Cell col={4}>
                <Card shadow={0} style={{width: '100%', height: '320px', margin: 'auto'}}>
                    <CardTitle style={{height:'180px',color: '#fff', background: 'url('+this.props.value.content.image+')bottom right 15% no-repeat #46B6AC',backgroundSize:'cover'}}></CardTitle>
                    <CardText style={{width:'100%',textAlign:'center'}}>
                        {this.props.value.content.description}
                    </CardText>
                    <CardActions border>
                    <div style={{display: 'flex','justify-content': 'space-between'}}>
                        <Button colored>{this.props.value.content.title}</Button>
                        <Button colored onClick={() => {
                           this.props.msg.success('One item of '+this.props.value.content.title+' has added to the cart successfully')
                           this.props.addToCart({
                                 key: this.props.value.key,
                                 price: this.props.value.content.price,
                                 image: this.props.value.content.image,
                                 title: this.props.value.content.title,
                                 description: this.props.value.content.shortDescription
                             })
                        }     
                        }>購入</Button>
                    </div>
                    </CardActions>
                </Card>
            </Cell>
            
            
        )
    }
}
export default connect(
    (state) => ({  cartItems : state.cart.cartItems }),
    {
      addToCart,
    }
  )(Item);
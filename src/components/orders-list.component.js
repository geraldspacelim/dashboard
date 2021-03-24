import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'

const Order = props => (
    <tr className= {props.order.modified ? "table-warning" : "table-light"}>
      <td>{props.order.address.name}</td>
      <td>{props.order.date}</td>
      <td>{displayCart(props.order.cart)}</td>
      <td>${props.order.totalCost}</td>
      <td>s{props.order.address.postal} | #{props.order.address.unit}</td>
      <td>{props.order.address.phone}</td>
      <td>{props.order.usedPromoCode}</td>
      <td>{props.order.orderStatus}</td>
      <td>
        <Link to={"/edit/"+props.order._id}>edit</Link> | <a href="#" onClick={() => { props.deleteOrder(props.order._id) }}>delete</a>
      </td>
    </tr>
)

function displayCart(cart) {
    let cartString = ""
    cart.map(item => {
        cartString += `${item.name} (${item.quantity})\n` 
    })
    return cartString
}

export default class OrdersList extends Component {

    constructor(props) {
        super(props);

        this.deleteOrder = this.deleteOrder.bind(this);

        this.state = {
            orders: []
        };
    }

    componentDidMount() {
        axios.get('https://swiftys-server.glitch.me/api/orders/getOrders')
            .then(response => {
                // console.log(response.data)
                this.setState({ 
                    orders: response.data
                })
            })
            .catch((error) => {
                console.log(error);
            })
    }

    deleteOrder(id) {
        console.log(id)
        axios.delete('https://swiftys-server.glitch.me/api/orders/deleteOrder/' + id)
            .then(res => console.log(res.data));
            this.setState({
                orders: this.state.orders.filter(el => el._id !== id)
            })
    }

    ordersList(){
        return this.state.orders.map(currentOrder => {
          return <Order order={currentOrder} deleteOrder={this.deleteOrder} key={currentOrder._id}/>;
        })
    }


    render() {
        return (
            <div>
                <h3>Logged Orders</h3>
                <table className="table">
                <thead className="thead-light">
                    <tr>
                    <th>Customer Name</th>
                    <th>Date-Time</th>
                    <th>Customer Cart</th>
                    <th>Total Cost</th>
                    <th>Customer Address</th>
                    <th>Customer Contact </th>
                    <th>Used Promo Code</th>
                    <th>Order Status</th>
                    <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    { this.ordersList() }
                </tbody>
                </table>
            </div>
        )
    }
}
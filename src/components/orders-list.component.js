import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'

const Order = props => (
    <tr>
      <td>{props.order.orderId}</td>
      <td>{props.order.dateTime}</td>
      <td>{JSON.stringify(props.order.cart)}</td>
      <td>${props.order.totalCost}</td>
      <td>s{props.order.address.postal} | #{props.order.address.unit}</td>
      <td>{props.order.address.phone}</td>
      <td>{props.order.usedPromoCode}</td>
      <td>{props.order.orderStatus}</td>
      <td>
        <Link to={"/edit/"+props.order._id}>edit</Link> | <a href="#" onClick={() => { props.deleteOrder(props.order._id) }}>delete</a>
        | <a href="#" onClick={() => { props.deleteOrder(props.order._id) }}>Accept</a>
      </td>
    </tr>
)

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
        axios.delete('https://swiftys-server.glitch.me/api/orders/deleteOrder' + id)
            .then(res => console.log(res.data));
        
            this.setState({
                orders: this.state.orders.filter(el => el._id !== id)
            })
    }

    acceptOrder(id) {
        axios.delete('https://swiftys-server.glitch.me/deleteOrder' + id)
            .then(res => console.log(res.data));
        
            this.setState({
                orders: this.state.orders.filter(el => el._id !== id)
            })
    }

    ordersList(){
        // console.log(this.state.orders)
        return this.state.orders.map(currentOrder => {
        //   console.log(currentOrder.orderId)
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
                    <th>Order Id</th>
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
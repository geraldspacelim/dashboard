import React, { Component } from 'react';
import "react-datepicker/dist/react-datepicker.css"
import axios from 'axios'


export default class EditOrder extends Component {
    constructor(props) {
        super(props);

        this.onChangeCustomerName = this.onChangeCustomerName.bind(this);
        this.onChangeCustomerContact = this.onChangeCustomerContact.bind(this);
        this.onChangeCustomerPostal = this.onChangeCustomerPostal.bind(this);
        this.onChangeCustomerUnit = this.onChangeCustomerUnit.bind(this);
        this.onChangeUsedPromoCode = this.onChangeUsedPromoCode.bind(this);
        this.onChangeOrderStatus = this.onChangeOrderStatus.bind(this);
        this.onChangeOrderName = this.onChangeOrderName.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            cart: [],
            dateTime: new Date(),
            customerName: "",
            customerPostal: "", 
            customerUnit: "",
            totalCost: 0, 
            customerContact: "", 
            usedPromoCode: "", 
            orderStatus: "",
            products: [], 
            orderStatuses: ['-', "Accepted", "Delivered"],
        }
    }

    componentDidMount() {
        axios.get('https://swiftys-server.glitch.me/api/orders/order/' +this.props.match.params.id)
            .then(response => {
                // console.log(response)
                this.setState({
                    cart: response.data.cart, 
                    // dateTime: response.data.dateTime, 
                    customerName:response.data.address.name, 
                    customerPostal: response.data.address.postal,
                    customerUnit: response.data.address.unit,
                    totalCost: response.data.totalCost, 
                    customerContact:  response.data.address.phone,
                    usedPromoCode: response.data.usedPromoCode, 
                    orderStatus: response.data.orderStatus
                })
            })
        axios.get('https://swiftys-server.glitch.me/api/shop/jmart')
            .then(response => {
                if (response.data.length > 0) {
                    this.setState({
                        products: response.data[0].products,
                    })
                }                
            })
    }

    onChangeCustomerName(e) {
       this.setState({
            customerName: e.target.value
       }) 
    }

    onChangeCustomerContact(e) {
        this.setState({
            customerContact: e.target.value
        }) 
     }

     onChangeCustomerPostal(e) {
        this.setState({
            customerPostal: e.target.value
        }) 
    }

    onChangeCustomerUnit(e) {
        this.setState({
            customerUnit: e.target.value
        }) 
    }

    onChangeUsedPromoCode(e) {
        this.setState({
            customerUnit: e.target.value
        }) 
    }

    onChangeOrderStatus(e) {
        this.setState({
            orderStatus: e.target.value
        }) 
    }

    onChangeOrderName(index, e) {
        // console.log(e.target.options.selectedIndex)
        let tempCart = [...this.state.cart];
        tempCart[index].name =  e.target.value
        tempCart[index].id = e.target.options.selectedIndex
        this.setState({
            cart: tempCart
        })
    }

    onChangeOrderQty(index, e) {
        // console.log(e.target.options.selectedIndex)
        let tempCart = [...this.state.cart];
        tempCart[index].quantity =  e.target.value
        // tempCart[index].id = e.target.options.selectedIndex
        this.setState({
            cart: tempCart
        })
    }

    findProductPrice(id) {
        let product = this.state.products.find(product => product.id === id)
        if (product !== undefined) {
            return product.price
        }
    }  

    orderList() {
        return this.state.cart.map((product, index) => {
            return ( 
            <div className="row"> 
                <div className="col-4">
                    <select ref="userInput"
                            required
                            className="form-control"
                            value= {this.state.cart[index].name}
                            onChange={(e) => this.onChangeOrderName(index, e)}>
                            {
                                this.state.products.map(function(product) {
                                    return <option
                                    key={product.id}
                                    value={product.name}>{product.name}
                                    </option>;
                                })
                            }
                        </select>
                </div>
                <div className="col-4">
                    <input type="number"
                            required
                            className="form-control"
                            value={this.state.cart[index].quantity}
                            onChange={(e) => this.onChangeOrderQty(index, e)}
                    />
                </div>
                <div className="col-4">
                    <input className="form-control" type="text" placeholder={this.findProductPrice(product.id)} readOnly/>
                </div>
            </div>
        )
    }
        )
    }

    onSubmit(e) {
        e.preventDefault();

        const exercise = {
            username: this.state.username,
            description: this.state.description, 
            duration: this.state.duration, 
            date: this.state.date
        }

        console.log(exercise)

        axios.post('http://localhost:5000/exercises/update/' + this.props.match.params.id, exercise)
            .then(res => console.log(res.data));


        window.location = '/'
    }

    render() {
        return (
            <div className="container">
                <h3>Edit Order Log</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Products</label>
                        {this.orderList()}
                    </div>
                    <div className="form-group">
                        <label>Customer Name: </label>
                        <input type="text"
                        required
                        className="form-control"
                        value={this.state.customerName}
                        onChange={this.onChangeCustomerName}
                        />
                    </div>
                    <div className="form-group">
                        <label>Customer Contact: </label>
                        <input type="text"
                        required
                        className="form-control"
                        value={this.state.customerContact}
                        onChange={this.onChangeCustomerContact}
                        />
                    </div>
                    <div className="form-group">
                        <label>Customer Postal: </label>
                        <input type="text"
                        required
                        className="form-control"
                        value={this.state.customerPostal}
                        onChange={this.onChangeCustomerPostal}
                        />
                    </div>
                    <div className="form-group">
                        <label>Customer Unit: </label>
                        <input type="text"
                        required
                        className="form-control"
                        value={this.state.customerUnit}
                        onChange={this.onChangeCustomerUnit}
                        />
                    </div>
                    <div className="form-group">
                        <label>Used Promo Code: </label>
                        <input type="text"
                        required
                        className="form-control"
                        value={this.state.usedPromoCode}
                        onChange={this.onChangeUsedPromoCode}
                        />
                    </div>
                    <div className="form-group">
                        <label>Order Status: </label>
                        <select ref="userInput"
                            required
                            className="form-control"
                            value={this.state.orderStatus}
                            onChange={this.onChangeOrderStatus}>
                            {
                                this.state.orderStatuses.map(function(oState) {
                                    return <option
                                    key={oState}
                                    value={oState}>{oState}
                                    </option>;
                                })
                            }
                        </select>
                    </div>

                    <div className="form-group">
                        <input type="submit" value="Save Order Log" className="btn btn-primary"/>
                    </div>
                </form>
            </div>
        )
    }

}
import React, { Component } from 'react';
import axios from 'axios'
import "../App.css"


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
        this.addEmptyProductField = this.addEmptyProductField.bind(this)
        this.removeProduct = this.removeProduct.bind(this)
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            cart: [],
            dateTime: new Date(),
            customerName: "",
            customerPostal: "", 
            customerUnit: "",
            totalCost: 0.0, 
            customerContact: "", 
            usedPromoCode: "", 
            orderStatus: "",
            products: [], 
            orderStatuses: [{id:1, value:'-'}, {id:2, value: "Accepted"}, {id:3, value:"Delivered"}],
        }
    }

    componentDidMount() {
        axios.get('https://swiftys-server.glitch.me/api/orders/order/' +this.props.match.params.id)
            .then(response => {
                this.setState({
                    cart: response.data.cart, 
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
            usedPromoCode: e.target.value
        }) 
    }

    onChangeOrderStatus(e) {
        this.setState({
            orderStatus: e.target.value
        }) 
    }

    onChangeOrderName(index, e) {
        let tempCart = [...this.state.cart];
        tempCart[index].name =  e.target.value
        tempCart[index].id = e.target.options.selectedIndex + 1
        tempCart[index].quantity = 1
        let newTotalCost = this.totalCost(tempCart)
        this.setState({
            cart: tempCart,
            totalCost: newTotalCost
        })
    }

    onChangeOrderQty(index, e) {
        let tempCart = [...this.state.cart];
        tempCart[index].quantity =  parseInt(e.target.value)
        let newTotalCost = this.totalCost(tempCart)
        this.setState({
            cart: tempCart,
            totalCost: newTotalCost
        })
    }

    findProductPrice(id) {
        let product = this.state.products.find(product => product.id === id)
        if (product !== undefined) {
            return product.price
        }
    }  

    totalCost(tempCart) {
        let newTotalCost = 0
        tempCart.map(product => {
            newTotalCost += this.findProductPrice(product.id) * product.quantity
        })
        return newTotalCost
    }

    removeProduct(index) {
        let tempCart = [...this.state.cart] 
        tempCart.splice(index, 1);
        let newTotalCost = this.totalCost(tempCart);
        this.setState({
            cart: tempCart,
            totalCost: newTotalCost
        })
    }


    addEmptyProductField(e){
        let tempCart = [...this.state.cart]
        tempCart.push({
            id: 1, 
            size: "", 
            quantity: 1, 
            name: ""
        })
        let newTotalCost = this.totalCost(tempCart)
        this.setState({
            cart: tempCart,
            totalCost: newTotalCost
        })
    }

    onSubmit(e) {
        e.preventDefault();

        const order = {
            cart: this.state.cart,
            address: {
                name: this.state.customerName, 
                phone: this.state.customerContact,
                unit: this.state.customerUnit, 
                postal: this.state.customerPostal
            }, 
            totalCost: this.state.totalCost, 
            orderStatus: this.state.orderStatus, 
            modified: true,
            usedPromoCode: this.state.usedPromoCode
        }

        console.log(order)

        axios.post('https://swiftys-server.glitch.me/api/orders/updateOrder/' + this.props.match.params.id, order)
            .then(res => console.log(res.data)).then((_) =>  window.location = '/');
    }

    orderList() {
        return this.state.cart.map((product, index) => { 
            return ( 
            <div key={product.id}>
            <div className="row product-row"> 
                <div className="col-3">
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
                <div className="col-3">
                    <input type="number"
                            min = "1"
                            required
                            className="form-control"
                            value={this.state.cart[index].quantity}
                            onChange={(e) => this.onChangeOrderQty(index, e)}
                    />
                </div>
                <div className="col-3">
                    <input className="form-control" type="text" placeholder={`$${parseFloat(this.findProductPrice(product.id) * product.quantity).toFixed(2)}`} readOnly/>
                </div>
                <div className="col-3">
                    <button type="button" className="btn btn-danger" onClick={(e) => this.removeProduct(index, e)}>Delete</button>  
                </div>
            </div>
            </div>
        )
    }
        )
    }

    render() {
        return (
            <div className="container">
                <h3>Edit Order Log</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                    <div className='parent'>
                        <div className='inline-block-child'>
                            <label>Products</label> 
                        </div>
                        <div className='product-label inline-block-child'>
                            <button type="button" className="btn btn-primary" onClick={this.addEmptyProductField}>Add</button>  
                        </div>
                        </div>
                        </div>
                        <div className="row">
                            <div className="col-3">
                                <h6>Product Name</h6>
                            </div>
                            <div className="col-3">
                                <h6>Product Quantity</h6>
                            </div>
                            <div className="col-3">
                                <h6>Total Cost</h6>
                            </div>
                            <div className="col-3">
                                <h6>Action</h6>
                            </div>
                        </div>
                        {this.orderList()}
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
                                    key={oState.id}
                                    value={oState.value}>{oState.value}
                                    </option>;
                                })
                            }
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Total Cost: </label>
                        <input className="form-control" type="text" placeholder={`$${parseFloat(this.state.totalCost).toFixed(2)}`} readOnly/>
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Save Order Log" className="btn btn-primary"/>
                    </div>
                </form>
            </div>
        )
    }

}
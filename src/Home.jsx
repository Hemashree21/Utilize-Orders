import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logout from './Logout';
import './App.css';
import { database } from './FirebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const Home = () => {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10;
    const [totalOrderValue, setTotalOrderValue] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        const getOrders = async () => {
            try {
                const ordersCollection = collection(database, 'orders');
                const ordersSnapshot = await getDocs(ordersCollection);
                const fetchedOrders = ordersSnapshot.docs.map(doc => {
                    const orderData = doc.data();
                    return {
                        orderId: doc.id,
                        customerEmail: orderData.customer_email,
                        customerName: orderData.customer_name,
                        orderValue: orderData.order_value,
                        product: orderData.product,
                        quantity: orderData.quantity,
                    };
                });
                fetchedOrders.sort(() => Math.random() - 0.5);

                const randomOrders = fetchedOrders.slice(0, 2000);
                setOrders(randomOrders);

                const totalValue = fetchedOrders.reduce((total, order) => total + order.orderValue, 0);
                setTotalOrderValue(totalValue);
            } catch (error) {
                console.error("Error fetching orders: ", error);
            }
        };

        getOrders();
    }, []);

    const handleEdit = (orderId) => {
        navigate(`/editorder/${orderId}`);
    };

    const handleDelete = async (orderId) => {
        try {
            await deleteDoc(doc(database, 'orders', orderId));
            setOrders(orders.filter(order => order.orderId !== orderId));
        } catch (error) {
            console.error("Error deleting order: ", error);
        }
    };

    const handleCreate = () => {
        navigate("/createorder");
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredOrders = orders.filter(order =>
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

    const nextPage = () => {
        if (currentPage < Math.ceil(filteredOrders.length / ordersPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="home">
            <div className="header">
                <div className='account-details'>
                    <h2>Welcome, {localStorage.getItem('name')}</h2>
                    <p>Email: {localStorage.getItem('email')}</p>
                </div>
                <Logout />
            </div>
            <div className="order-management">
                <input
                    type="text"
                    placeholder="Search Orders"
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <button onClick={handleCreate} className='btn-createorder'>Create New Order</button>
                <div className='total-order-value'>
                    Total Order Value: ${totalOrderValue.toFixed(2)}
                </div>
                <table border="1" className='styled-table'>
                    <thead>
                        <tr>
                            <th>Customer Name</th>
                            <th>Customer Email</th>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Order Value</th>
                            <th>More</th>
                        </tr>
                    </thead>
                    <tbody className='order-table'>
                        {currentOrders.map((order) => (
                            <tr key={order.orderId}>
                                <td className='order-table'>{order.customerName}</td>
                                <td className='order-table'>{order.customerEmail}</td>
                                <td className='order-table'>{order.product}</td>
                                <td className='order-table'>{order.quantity}</td>
                                <td className='order-table'>{order.orderValue}</td>
                                <td className='order-table-btn'>
                                    <button className='btn-edit' onClick={() => handleEdit(order.orderId)}>Edit</button>
                                    <button className='btn-delete' onClick={() => handleDelete(order.orderId)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pagination">
                    <button className='btn-pagination' onClick={prevPage} disabled={currentPage === 1}>Previous</button>
                    <button className='btn-pagination' onClick={nextPage} disabled={currentPage >= Math.ceil(filteredOrders.length / ordersPerPage)}>Next</button>
                </div>
            </div>
        </div>
    );
};

export default Home;
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { database } from './FirebaseConfig';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';

const productValues = {
    'Product 1': 29,
    'Product 2': 49,
    'Product 3': 149,
};

const CreateOrder = () => {
    const { id } = useParams();
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [product, setProduct] = useState('');
    const [quantity, setQuantity] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrder = async () => {
            if (id) {
                const docRef = doc(database, 'orders', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const order = docSnap.data();
                    setCustomerName(order.customer_name);
                    setCustomerEmail(order.customer_email);
                    setProduct(order.product);
                    setQuantity(order.quantity);
                } else {
                    console.log("No such document!");
                }
            }
        };

        fetchOrder();
    }, [id]);

    const validateForm = () => {
        const newErrors = {};

        if (customerName.length < 3) newErrors.customerName = 'Customer Name should have at least 3 characters';
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(customerEmail)) newErrors.customerEmail = 'Invalid email address';
        if (!product) newErrors.product = 'Product is required';
        if (!quantity || quantity <= 0) newErrors.quantity = 'Quantity should be greater than 0';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const calculatedOrderValue = productValues[product] * quantity;

        try {
            if (id) {
                const docRef = doc(database, 'orders', id);
                await updateDoc(docRef, {
                    customer_name: customerName,
                    customer_email: customerEmail,
                    product: product,
                    quantity: quantity,
                    order_value: calculatedOrderValue,
                });
            } else {
                await addDoc(collection(database, 'orders'), {
                    customer_name: customerName,
                    customer_email: customerEmail,
                    product: product,
                    quantity: quantity,
                    order_value: calculatedOrderValue,
                });
            }

            navigate('/');
        } catch (error) {
            console.error("Error saving order: ", error);
        }
    };

    return (
        <div className="create-order">
            <h2>{id ? 'Edit Order' : 'Create New Order'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Customer Name:</label>
                    <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                    />
                    {errors.customerName && <p className="error">{errors.customerName}</p>}
                </div>
                <div>
                    <label>Customer Email:</label>
                    <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        required
                    />
                    {errors.customerEmail && <p className="error">{errors.customerEmail}</p>}
                </div>
                <div>
                    <label>Product:</label>
                    <select
                        value={product}
                        onChange={(e) => setProduct(e.target.value)}
                        required
                    >
                        <option value="">Select Product</option>
                        <option value="Product 1">Product 1</option>
                        <option value="Product 2">Product 2</option>
                        <option value="Product 3">Product 3</option>
                    </select>
                    {errors.product && <p className="error">{errors.product}</p>}
                </div>
                <div>
                    <label>Quantity:</label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        required
                    />
                    {errors.quantity && <p className="error">{errors.quantity}</p>}
                </div>
                <div>
                    <label>Order Value:</label>
                    <input
                        type="number"
                        value={product ? productValues[product] * quantity : 0}
                        readOnly
                    />
                </div>
                <button type="submit">{id ? 'Update Order' : 'Create Order'}</button>
            </form>
        </div>
    );
};

export default CreateOrder;
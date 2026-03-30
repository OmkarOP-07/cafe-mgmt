import { useState, useEffect } from 'react'
import axios from 'axios'
import './Admin.css'

export default function AdminOrders() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const statuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled']

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/orders')
            setOrders(res.data)
            setError(null)
        } catch (err) {
            setError(err.response?.data?.message || err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axios.patch(`http://localhost:5000/api/orders/${orderId}/status`, { status: newStatus })
            // Update local state to reflect change without full refetch
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o))
        } catch (err) {
            alert('Error updating status: ' + (err.response?.data?.message || err.message))
        }
    }

    const getStatusBadgeClass = (status) => {
        switch(status) {
            case 'delivered': return 'success'
            case 'cancelled': return 'danger'
            case 'pending': return 'warning'
            default: return 'info'
        }
    }

    if (loading) return <div className="loading-container"><div className="spinner"></div></div>
    if (error) return <div className="card"><p style={{color: 'red'}}>Error: {error}</p></div>

    return (
        <div className="admin-page animate-fadeIn">
            <div className="admin-page-header">
                <h2>Order Management</h2>
            </div>

            <div className="admin-table-container glass-card">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Total (₹)</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td>
                                    <div className="text-small" style={{fontFamily: 'monospace'}}>{order._id}</div>
                                </td>
                                <td>{new Date(order.orderDate).toLocaleString()}</td>
                                <td>
                                    <strong>{order.customerName}</strong>
                                    <div className="text-small">{order.customerEmail}</div>
                                </td>
                                <td>
                                    <ul style={{listStyle: 'none', padding: 0, margin: 0, fontSize: '0.875rem'}}>
                                        {order.items.map((item, idx) => (
                                            <li key={idx}>{item.quantity}x {item.name}</li>
                                        ))}
                                    </ul>
                                </td>
                                <td>₹{order.finalTotal}</td>
                                <td>
                                    <select 
                                        className={`form-select status-badge ${getStatusBadgeClass(order.status)}`}
                                        style={{width: 'auto', padding: '0.25rem 1.5rem 0.25rem 0.5rem', appearance: 'auto'}}
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                    >
                                        {statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                    </select>
                                </td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr><td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>No orders found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

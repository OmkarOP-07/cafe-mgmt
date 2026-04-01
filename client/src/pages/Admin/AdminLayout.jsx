import { Outlet, NavLink } from 'react-router-dom'
import './AdminLayout.css'

function AdminLayout() {
    return (
        <div className="admin-layout">
            <div className="admin-sidebar glass">
                <h3 className="admin-sidebar-title">Admin Dashboard</h3>
                <nav className="admin-nav">
                    <NavLink to="/admin/menu" className={({isActive}) => isActive ? "admin-nav-link active" : "admin-nav-link"}>
                        Menu Management
                    </NavLink>
                    <NavLink to="/admin/orders" className={({isActive}) => isActive ? "admin-nav-link active" : "admin-nav-link"}>
                        Order Management
                    </NavLink>
                    <NavLink to="/admin/users" className={({isActive}) => isActive ? "admin-nav-link active" : "admin-nav-link"}>
                        User Management
                    </NavLink>
                </nav>
            </div>
            <div className="admin-content">
                <Outlet />
            </div>
        </div>
    )
}

export default AdminLayout

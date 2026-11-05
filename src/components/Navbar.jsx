import React from 'react'
import AdminNavbar from './AdminNavbar'
import { useSelector } from 'react-redux';
import UserNavbar from './UserNavbar';

export default function Navbar() {
  const { token, role } = useSelector((state) => state.auth);
  return (
    <div>
      {role === "admin" ? <AdminNavbar /> : <UserNavbar />}
    </div>
  )
}

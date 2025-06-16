import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { FaShoppingCart } from 'react-icons/fa';
import { UserContext } from '../stores/UserContext';

const CartIcon = () => {
    const { user } = useContext(UserContext);
    const user_id = user?.id;
    const totalItems = useCartStore((state) => state.getTotalItems());
    const fetchCart = useCartStore((state) => state.fetchCart);

    useEffect(() => {
        if (user_id) fetchCart(user_id);
    }, [user_id, fetchCart]);

    return (
        <Link to="/cart" className="relative">
            <FaShoppingCart className="text-2xl text-gray-700 hover:text-gray-900" />
            {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                </span>
            )}
        </Link>
    );
};

export default CartIcon; 
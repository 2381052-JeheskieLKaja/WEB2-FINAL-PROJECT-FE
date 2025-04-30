// src/components/TiketItem.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Tiket } from '../types/Tiket';

interface TiketItemProps {
  tiket: Tiket;
  onEdit: (tiket: Tiket) => void;
  onDelete: (id: number) => void;
  isDeleting: boolean; // To disable delete button during operation
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 },
};


const TiketItem: React.FC<TiketItemProps> = ({ tiket, onEdit, onDelete, isDeleting }) => {
  const handleDeleteClick = () => {
      if (window.confirm(`Are you sure you want to delete ticket "${tiket.nama}"?`)) {
          onDelete(tiket.id);
      }
  }

  const formatDate = (dateString: string | Date | undefined) => {
      if (!dateString) return 'N/A';
      try {
          return new Date(dateString).toLocaleString(); // Or use more specific formatting
      } catch (e) {
          return 'Invalid Date';
      }
  }

  return (
    <motion.li
      variants={itemVariants}
      layout // Animate layout changes (e.g., when item is deleted)
      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
      className="bg-white shadow-md rounded-lg p-4 mb-4 flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0"
    >
      <div className="flex-1 mr-4">
        <h3 className="text-xl font-semibold text-indigo-700">{tiket.nama}</h3>
        <p className="text-sm text-gray-600"><span className='font-medium'>Location:</span> {tiket.lokasi}</p>
        <p className="text-sm text-gray-600"><span className='font-medium'>Date:</span> {formatDate(tiket.tanggal)}</p>
        <div className="flex space-x-4 text-sm text-gray-800 mt-1">
            <p><span className='font-medium'>Price:</span> Rp {tiket.harga.toLocaleString('id-ID')}</p>
            <p><span className='font-medium'>Stock:</span> {tiket.stok}</p>
        </div>
      </div>
      <div className="flex space-x-2 flex-shrink-0">
        <button
          onClick={() => onEdit(tiket)}
          className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 transition duration-150"
        >
          Edit
        </button>
        <button
          onClick={handleDeleteClick}
          disabled={isDeleting}
          className={`px-3 py-1 text-white text-sm rounded transition duration-150 ${isDeleting ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}`}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </motion.li>
  );
};

export default TiketItem;
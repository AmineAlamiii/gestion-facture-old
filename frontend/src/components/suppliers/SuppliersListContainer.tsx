import React, { useState } from 'react';
import { useSuppliers } from '../../hooks/useSuppliers';
import SuppliersList from './SuppliersList';
import SupplierForm from './SupplierForm';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';

const SuppliersListContainer: React.FC = () => {
  const [editingSupplier, setEditingSupplier] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  
  const { 
    suppliers, 
    loading, 
    error, 
    createSupplier, 
    updateSupplier, 
    deleteSupplier 
  } = useSuppliers();

  const handleCreateNew = () => {
    setEditingSupplier(null);
    setShowForm(true);
  };

  const handleEdit = (supplier: any) => {
    setEditingSupplier(supplier);
    setShowForm(true);
  };

  const handleSave = async (supplierData: any) => {
    try {
      if (editingSupplier) {
        await updateSupplier(editingSupplier.id, supplierData);
      } else {
        await createSupplier(supplierData);
      }
      setShowForm(false);
      setEditingSupplier(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSupplier(id);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSupplier(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" text="Chargement des fournisseurs..." />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage 
        error={error}
        className="mb-4"
      />
    );
  }

  if (showForm) {
    return (
      <SupplierForm
        supplier={editingSupplier}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <SuppliersList
      suppliers={suppliers}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onCreateNew={handleCreateNew}
    />
  );
};

export default SuppliersListContainer;

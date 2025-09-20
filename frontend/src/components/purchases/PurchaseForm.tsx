import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { PurchaseInvoice, Supplier, InvoiceItem } from '../../types';
import { generateInvoiceNumber, calculateTotal } from '../../utils/invoiceUtils';
import SearchableSelect from '../common/SearchableSelect';

interface PurchaseFormProps {
  purchase?: PurchaseInvoice;
  suppliers: Supplier[];
  onSave: (purchase: Omit<PurchaseInvoice, 'id'>) => void;
  onCancel: () => void;
}

const PurchaseForm: React.FC<PurchaseFormProps> = ({
  purchase,
  suppliers,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    invoiceNumber: purchase?.invoiceNumber || generateInvoiceNumber('ACH'),
    supplier: purchase?.supplier || null,
    date: purchase?.date || new Date().toISOString().split('T')[0],
    dueDate: purchase?.dueDate || '',
    status: purchase?.status || 'pending' as const,
    notes: purchase?.notes || '',
    items: purchase?.items || [
      {
        id: '1',
        description: '',
        quantity: 1,
        unitPrice: 0,
        total: 0,
        taxRate: 20,
      },
    ] as InvoiceItem[],
  });

  const selectedSupplier = formData.supplier;

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
    }
    
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
      taxRate: 20,
    };
    setFormData({ ...formData, items: [...formData.items, newItem] });
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData({ ...formData, items: newItems });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Validation du formulaire:', {
      selectedSupplier,
      itemsLength: formData.items.length,
      formData
    });
    
    if (!selectedSupplier) {
      console.error('Aucun fournisseur sélectionné');
      alert('Veuillez sélectionner un fournisseur');
      return;
    }
    
    if (formData.items.length === 0) {
      console.error('Aucun article ajouté');
      alert('Veuillez ajouter au moins un article');
      return;
    }

    const total = calculateTotal(formData.items);
    const subtotal = formData.items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = formData.items.reduce((sum, item) => sum + (item.total * item.taxRate / 100), 0);

    console.log('Données à sauvegarder:', {
      invoiceNumber: formData.invoiceNumber,
      supplier: selectedSupplier,
      date: formData.date,
      dueDate: formData.dueDate,
      items: formData.items,
      subtotal,
      taxAmount,
      total,
      status: formData.status,
      notes: formData.notes,
    });

    onSave({
      invoiceNumber: formData.invoiceNumber,
      supplier: selectedSupplier,
      date: formData.date,
      dueDate: formData.dueDate,
      items: formData.items,
      subtotal,
      taxAmount,
      total,
      status: formData.status,
      notes: formData.notes,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-4 lg:px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-base lg:text-lg font-semibold text-gray-800">
          {purchase ? 'Modifier la facture d\'achat' : 'Nouvelle facture d\'achat'}
        </h3>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-4 lg:p-6 space-y-4 lg:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro de facture
              </label>
              <input
                type="text"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                required
              />
            </div>

            <SearchableSelect
              options={suppliers}
              value={formData.supplier?.id || ''}
              onChange={(value) => {
                if (value && typeof value === 'object') {
                  setFormData({ ...formData, supplier: value });
                } else if (value === null) {
                  setFormData({ ...formData, supplier: null });
                }
              }}
              placeholder="Sélectionner un fournisseur"
              label="Fournisseur"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date d'échéance
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
            >
              <option value="pending">En attente</option>
              <option value="paid">Payé</option>
              <option value="overdue">En retard</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
             <h4 className="text-base lg:text-lg font-medium text-gray-800">Articles</h4>
              <button
                type="button"
                onClick={addItem}
               className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center text-xs lg:text-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Ajouter
              </button>
            </div>

            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantité
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prix unitaire
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        TVA (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={item.taxRate}
                        onChange={(e) => updateItem(index, 'taxRate', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="w-full bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                        disabled={formData.items.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-right">
                  <span className="text-xs lg:text-sm font-medium text-gray-700">
                      Total: {(item.total + (item.total * item.taxRate / 100)).toFixed(2)} DH
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-3 lg:p-4">
            <div className="flex justify-between items-center text-base lg:text-lg font-semibold">
              <span>Total TTC:</span>
              <span>{calculateTotal(formData.items).toFixed(2)} DH</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 lg:px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm lg:text-base"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 lg:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm lg:text-base"
            >
              {purchase ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
    </div>
  );
};

export default PurchaseForm;
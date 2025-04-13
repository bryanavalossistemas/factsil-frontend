import { SaleForm } from '@/schemas/sales';
import { useState, useRef, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

interface CartItemProductNameProps {
  descripcion: string;
  id: number;
}

export default function CartItemProductName({ id, descripcion }: CartItemProductNameProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(descripcion);
  const displayRef = useRef<HTMLDivElement>(null);
  const editRef = useRef<HTMLDivElement>(null);

  const { setValue, getValues } = useFormContext<SaleForm>();

  useEffect(() => {
    setEditValue(descripcion);
  }, [descripcion]);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditValue(descripcion);
  };

  useEffect(() => {
    if (isEditing && editRef.current) {
      const range = document.createRange();
      range.selectNodeContents(editRef.current);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [isEditing]);

  const handleSave = () => {
    const newValue = editRef.current?.innerText.trim() || '';
    setValue(
      'sale_details',
      getValues('sale_details').map((d) => (d.id === id ? { ...d, descripcion: newValue } : d)),
    );
    // updateProductName(id, newValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsEditing(false);
    }
  };

  return (
    <>
      <div
        ref={displayRef}
        onDoubleClick={handleDoubleClick}
        className={`px-1 py-0.5 rounded-md hover:bg-accent hover:cursor-pointer select-none ${isEditing ? 'hidden' : ''}`}
      >
        {descripcion}
      </div>

      <div
        ref={editRef}
        contentEditable
        suppressContentEditableWarning
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={`px-1 py-0.5 rounded-md focus-visible:outline-ring focus-visible:bg-transparent ${!isEditing ? 'hidden' : ''}`}
        dangerouslySetInnerHTML={{ __html: editValue }}
      />
    </>
  );
}

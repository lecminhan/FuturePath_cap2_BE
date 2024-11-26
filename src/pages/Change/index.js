import React, { useState } from 'react';
import NotificationIcons from '../../components/Notifications';
import useFetchWashingTypes from '../../hooks/useFetchWashingTypes';
import { Save } from 'lucide-react';
import useUpdateWashingType from '../../hooks/useUpdateWashingType';  // Import the new hook
import style from './style.css';

function Change() {
  const { data, loading, error } = useFetchWashingTypes();
  const { updateWashingType } = useUpdateWashingType();  // Use the hook to update washing type
  const [editValues, setEditValues] = useState({});

  // Handle input changes for typeName, duration, and price
  const handleChange = (id, field, value) => {
    // If the value is a number (duration or price), ensure it's not negative
    if (field === 'defaultDuration' || field === 'defaultPrice') {
      // If the value is a number and is negative, reset to 0
      if (value < 0) {
        value = 0;
      }
    }

    setEditValues(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value === "" ? "" : value // Save empty inputs as empty string
      }
    }));
  };

  // Handle saving updated values for typeName, duration, and price
  const handleSave = async (id) => {
    const updatedValues = editValues[id];
    if (updatedValues) {
      // Find the original type by id from the data array
      const type = data.find(t => t.id === id);

      const updatedData = {
        id,
        typeName: updatedValues.typeName ?? type.typeName,  // Ensure typeName is included and defaults to original value if not edited
        defaultDuration: updatedValues.defaultDuration ?? type.defaultDuration, // Ensure defaultDuration is included and defaults to original value if not edited
        defaultPrice: updatedValues.defaultPrice ?? type.defaultPrice // Ensure defaultPrice is included and defaults to original value if not edited
      };

      try {
        await updateWashingType(id, updatedData);
        setEditValues(prev => ({ ...prev, [id]: {} }));  // Clear the saved edits for that ID
        alert('Cập nhật thành công');
        window.location.reload();
      } catch (error) {
        alert('Có lỗi khi cập nhật');
      }
    }
  };

  // Handle loading and error states
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data: {error}</div>;
  if (!data || data.length === 0) return <div>No data available</div>;

  return (
    <div className="change">
      <div className="header">
        <div className="reload">
          <NotificationIcons />
        </div>
      </div>
      <div className="change-table">
        <table>
          <thead>
            <tr>
              <th>ID Loại</th>
              <th>Tên Loại</th>
              <th>Thời Gian Mặc Định (phút)</th>
              <th>Giá Mặc Định (VND)</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {data.map((type) => (
              <tr key={type.id}>
                <td>{type.id}</td>
                <td>
                  <input 
                    type="tname-text"
                    value={editValues[type.id]?.typeName ?? type.typeName}
                    onChange={(e) => handleChange(type.id, 'typeName', e.target.value)}
                  />
                </td>
                <td>
                  <input 
                    type="tname-number"
                    value={editValues[type.id]?.defaultDuration ?? type.defaultDuration}
                    onChange={(e) => handleChange(type.id, 'defaultDuration', e.target.value === "" ? "" : Number(e.target.value))}
                  />
                </td>
                <td>
                  <input
                    type="tname-number"
                    value={editValues[type.id]?.defaultPrice ?? type.defaultPrice}
                    onChange={(e) => handleChange(type.id, 'defaultPrice', e.target.value === "" ? "" : Number(e.target.value))}
                  />
                </td>
                <td>
                  <button className='btn-wstype'
                    onClick={() => handleSave(type.id)}
                    disabled={ 
                      !editValues[type.id] || 
                      (editValues[type.id].typeName === type.typeName && 
                       editValues[type.id].defaultDuration === type.defaultDuration &&
                       editValues[type.id].defaultPrice === type.defaultPrice) // Check if any value is changed
                    }
                  >
                    <Save/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Change;

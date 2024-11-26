// src/components/AddMachineForm.js
import React from 'react';
import './AddMachineForm.css';
import useLocations from '../../hooks/useLocations';
import useAddMachineForm from '../../hooks/useAddMachineForm';
import { X ,LoaderCircle} from 'lucide-react';

const AddMachineForm = ({ onClose }) => {
  const { locations, loading, error } = useLocations();
  const { formData, handleChange, handleSubmit } = useAddMachineForm(onClose);

  if (loading) {
    return <LoaderCircle/>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="overlay">
      <div className="form-container">
        <button className="close-button" onClick={onClose}><X/></button>
        <h2>Thêm Máy Giặt Mới</h2>
        <form onSubmit={handleSubmit}>
          <label>Tên Máy Giặt:
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </label>
          <label>Model:
            <input type="text" name="model" value={formData.model} onChange={handleChange} required />
          </label>
          <label>Dung Tích:
            <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} required />
          </label>
          <label>Địa Điểm:
            <select name="locationId" value={formData.locationId} onChange={handleChange} required>
              <option value="">Chọn địa điểm</option>
              {locations && locations.length > 0 ? (
                locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name} - {location.address}
                    {location.city && `, ${location.city}`}
                    {location.district && `, ${location.district}`}
                    {location.ward && `, ${location.ward}`}
                  </option>
                ))
              ) : (
                <option value="">Không có địa điểm</option>
              )}
            </select>
          </label>
          <button type="submit">Thêm Máy Giặt</button>
        </form>
      </div>
    </div>
  );
};

export default AddMachineForm;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './ProfessionalRegistration.css';

const ProfessionalRegistration = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [userLocation, setUserLocation] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    pricePerHour: '',
    phone: '',
    address: '',
    experience: '',
    availability: {
      monday: { available: false, start: '09:00', end: '18:00' },
      tuesday: { available: false, start: '09:00', end: '18:00' },
      wednesday: { available: false, start: '09:00', end: '18:00' },
      thursday: { available: false, start: '09:00', end: '18:00' },
      friday: { available: false, start: '09:00', end: '18:00' },
      saturday: { available: false, start: '09:00', end: '18:00' },
      sunday: { available: false, start: '09:00', end: '18:00' }
    },
    skills: [],
    newSkill: ''
  });

  const categories = [
    { id: 'plomero', name: 'Plomería', icon: '🔧' },
    { id: 'electricista', name: 'Electricista', icon: '⚡' },
    { id: 'carpintero', name: 'Carpintería', icon: '🔨' },
    { id: 'pintor', name: 'Pintura', icon: '🎨' },
    { id: 'jardinero', name: 'Jardinería', icon: '🌱' },
    { id: 'limpieza', name: 'Limpieza', icon: '🧹' },
    { id: 'mecanico', name: 'Mecánica', icon: '🔧' },
    { id: 'albanil', name: 'Albañilería', icon: '🧱' },
    { id: 'soldador', name: 'Soldadura', icon: '🔥' },
    { id: 'tapicero', name: 'Tapicería', icon: '🪑' },
    { id: 'cerrajero', name: 'Cerrajería', icon: '🔐' },
    { id: 'gasista', name: 'Gasfitería', icon: '🔧' }
  ];

  const dayNames = {
    monday: 'Lunes',
    tuesday: 'Martes',
    wednesday: 'Miércoles',
    thursday: 'Jueves',
    friday: 'Viernes',
    saturday: 'Sábado',
    sunday: 'Domingo'
  };

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else {
      setFormData(prev => ({ ...prev, name: currentUser.displayName || '' }));
      getCurrentLocation();
    }
  }, [currentUser, navigate]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvailabilityChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          [field]: value
        }
      }
    }));
  };

  const addSkill = () => {
    if (formData.newSkill.trim() && !formData.skills.includes(formData.newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, prev.newSkill.trim()],
        newSkill: ''
      }));
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.name && formData.category && formData.description;
      case 2:
        return formData.pricePerHour && formData.phone && formData.address;
      case 3:
        return formData.experience && formData.skills.length > 0;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      setError('');
    } else {
      setError('Por favor completa todos los campos obligatorios');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(3)) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/professionals/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          location: userLocation,
          pricePerHour: parseFloat(formData.pricePerHour)
        })
      });

      if (response.ok) {
        setSuccess('¡Registro exitoso! Tu perfil de profesional ha sido creado.');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.message || 'Error al registrar el profesional');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h3>Información Básica</h3>
            
            <div className="form-group">
              <label>Nombre completo *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Tu nombre completo"
                required
              />
            </div>

            <div className="form-group">
              <label>Categoría de servicio *</label>
              <div className="categories-grid">
                {categories.map(category => (
                  <div
                    key={category.id}
                    className={`category-option ${formData.category === category.id ? 'selected' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, category: category.id }))}
                  >
                    <span className="category-icon">{category.icon}</span>
                    <span className="category-name">{category.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Descripción de tu servicio *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe brevemente los servicios que ofreces..."
                rows="4"
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <h3>Detalles de Contacto y Precio</h3>
            
            <div className="form-group">
              <label>Precio por hora (S/.) *</label>
              <input
                type="number"
                name="pricePerHour"
                value={formData.pricePerHour}
                onChange={handleInputChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label>Teléfono de contacto *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+51 999 999 999"
                required
              />
            </div>

            <div className="form-group">
              <label>Dirección *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Tu dirección completa"
                required
              />
            </div>

            <div className="form-group">
              <label>Disponibilidad semanal</label>
              <div className="availability-grid">
                {Object.entries(formData.availability).map(([day, schedule]) => (
                  <div key={day} className="availability-row">
                    <div className="day-checkbox">
                      <input
                        type="checkbox"
                        id={day}
                        checked={schedule.available}
                        onChange={(e) => handleAvailabilityChange(day, 'available', e.target.checked)}
                      />
                      <label htmlFor={day}>{dayNames[day]}</label>
                    </div>
                    
                    {schedule.available && (
                      <div className="time-inputs">
                        <input
                          type="time"
                          value={schedule.start}
                          onChange={(e) => handleAvailabilityChange(day, 'start', e.target.value)}
                          className="time-input"
                        />
                        <span>-</span>
                        <input
                          type="time"
                          value={schedule.end}
                          onChange={(e) => handleAvailabilityChange(day, 'end', e.target.value)}
                          className="time-input"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <h3>Experiencia y Habilidades</h3>
            
            <div className="form-group">
              <label>Años de experiencia *</label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecciona tu experiencia</option>
                <option value="menos-1">Menos de 1 año</option>
                <option value="1-3">1-3 años</option>
                <option value="3-5">3-5 años</option>
                <option value="5-10">5-10 años</option>
                <option value="mas-10">Más de 10 años</option>
              </select>
            </div>

            <div className="form-group">
              <label>Habilidades específicas *</label>
              <div className="skills-input">
                <input
                  type="text"
                  name="newSkill"
                  value={formData.newSkill}
                  onChange={handleInputChange}
                  placeholder="Añadir habilidad..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <button type="button" onClick={addSkill} className="add-skill-btn">
                  Añadir
                </button>
              </div>
              
              <div className="skills-list">
                {formData.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                    <button 
                      type="button" 
                      onClick={() => removeSkill(skill)}
                      className="remove-skill"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              
              {formData.skills.length === 0 && (
                <p className="help-text">Añade al menos una habilidad específica</p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!currentUser) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="professional-registration">
      <div className="container">
        <div className="registration-header">
          <h1>Registro de Profesional</h1>
          <p>Completa tu perfil para empezar a ofrecer tus servicios</p>
          
          <div className="step-indicator">
            {[1, 2, 3].map(step => (
              <div
                key={step}
                className={`step ${currentStep >= step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}
              >
                <div className="step-number">{step}</div>
                <div className="step-title">
                  {step === 1 && 'Información Básica'}
                  {step === 2 && 'Contacto y Precio'}
                  {step === 3 && 'Experiencia'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="registration-form">
          {renderStep()}

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="form-navigation">
            {currentStep > 1 && (
              <button type="button" onClick={prevStep} className="btn-secondary">
                Anterior
              </button>
            )}
            
            {currentStep < 3 ? (
              <button type="button" onClick={nextStep} className="btn-primary">
                Siguiente
              </button>
            ) : (
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Registrando...' : 'Completar Registro'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfessionalRegistration;
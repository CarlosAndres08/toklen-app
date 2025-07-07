import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { professionalService } from '../services/api'; // <--- AÑADIDA IMPORTACIÓN
import "../styles/ProfessionalRegistration.css"; // ✅ Ruta correcta


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
    setSuccess(''); // Limpiar mensaje de éxito anterior

    const professionalData = {
      ...formData,
      location: userLocation, // Asegúrate que userLocation tenga lat y lng
      pricePerHour: parseFloat(formData.pricePerHour) || 0,
      // El backend esperará el userId del token decodificado, no es necesario enviarlo aquí.
      // email: currentUser.email // Opcional, el backend puede obtenerlo del token también
    };

    try {
      // No es necesario obtener el token manualmente aquí si el interceptor de Axios está configurado
      // const token = await currentUser.getIdToken(); 
      // La cabecera de Authorization la pondrá el interceptor de api.js

      const response = await professionalService.register(professionalData);

      // Asumiendo que el backend devuelve un objeto con `data` en la respuesta exitosa de Axios
      if (response.data) { 
        setSuccess('¡Registro exitoso! Tu perfil de profesional ha sido creado.');
        setTimeout(() => {
          navigate('/dashboard'); // O a una página de "perfil de profesional creado"
        }, 2500);
      } else {
        // Esto no debería ocurrir con una respuesta exitosa de Axios que devuelve datos
        setError(response.message || 'Respuesta inesperada del servidor.');
      }
    } catch (err) {
      console.error('Error en el registro del profesional:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Error desconocido al registrar el profesional. Intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content space-y-6">
            <h3 className="text-xl font-semibold text-secondary mb-6 text-center md:text-left">Información Básica del Profesional</h3>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-secondary mb-1">Nombre completo *</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ej: Juan Pérez"
                required
                className="w-full px-4 py-2.5 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-150 bg-base-100 placeholder-neutral/60"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Categoría de servicio *</label>
              <div className="categories-grid grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                {categories.map(category => (
                  <div
                    key={category.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-150 flex flex-col items-center justify-center space-y-1 text-center
                               ${formData.category === category.id 
                                 ? 'border-primary bg-primary/10 ring-2 ring-primary shadow-md' 
                                 : 'border-neutral bg-base-100 hover:border-primary hover:bg-primary/5 hover:shadow-sm'}`}
                    onClick={() => setFormData(prev => ({ ...prev, category: category.id }))}
                  >
                    <span className={`text-3xl ${formData.category === category.id ? 'text-primary' : 'text-neutral/80'}`}>{category.icon}</span>
                    <span className={`text-xs sm:text-sm font-medium ${formData.category === category.id ? 'text-primary' : 'text-secondary'}`}>{category.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-secondary mb-1">Descripción de tu servicio *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe brevemente los servicios que ofreces, tu especialidad, etc."
                rows="4"
                required
                className="w-full px-4 py-2.5 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-150 bg-base-100 placeholder-neutral/60"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content space-y-6">
            <h3 className="text-xl font-semibold text-secondary mb-6 text-center md:text-left">Detalles de Contacto, Precio y Disponibilidad</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="pricePerHour" className="block text-sm font-medium text-secondary mb-1">Precio por hora (S/.) *</label>
                <input
                  id="pricePerHour"
                  type="number"
                  name="pricePerHour"
                  value={formData.pricePerHour}
                  onChange={handleInputChange}
                  placeholder="Ej: 50.00"
                  min="0"
                  step="0.01"
                  required
                  className="w-full px-4 py-2.5 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-150 bg-base-100 placeholder-neutral/60"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-secondary mb-1">Teléfono de contacto *</label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Ej: +51 987654321"
                  required
                  className="w-full px-4 py-2.5 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-150 bg-base-100 placeholder-neutral/60"
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-secondary mb-1">Dirección (Referencial) *</label>
              <input
                id="address"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Ej: Av. Principal 123, Miraflores (para definir tu zona de cobertura)"
                required
                className="w-full px-4 py-2.5 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-150 bg-base-100 placeholder-neutral/60"
              />
               <p className="text-xs text-neutral mt-1">Esta dirección se usará para que los clientes te encuentren por cercanía.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Disponibilidad Semanal</label>
              <div className="availability-grid space-y-3">
                {Object.entries(formData.availability).map(([day, schedule]) => (
                  <div key={day} className="availability-row flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border border-neutral/30 rounded-lg hover:border-primary/50 transition-colors duration-150">
                    <div className="day-checkbox flex items-center space-x-3 mb-2 sm:mb-0">
                      <input
                        type="checkbox"
                        id={day}
                        checked={schedule.available}
                        onChange={(e) => handleAvailabilityChange(day, 'available', e.target.checked)}
                        className="h-5 w-5 text-primary rounded border-neutral/50 focus:ring-primary/50 cursor-pointer"
                      />
                      <label htmlFor={day} className="text-sm font-medium text-secondary cursor-pointer select-none">{dayNames[day]}</label>
                    </div>
                    
                    {schedule.available && (
                      <div className="time-inputs flex items-center space-x-2">
                        <input
                          type="time"
                          value={schedule.start}
                          onChange={(e) => handleAvailabilityChange(day, 'start', e.target.value)}
                          className="time-input w-full sm:w-auto px-3 py-1.5 border border-neutral rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm bg-base-100"
                        />
                        <span className="text-neutral">-</span>
                        <input
                          type="time"
                          value={schedule.end}
                          onChange={(e) => handleAvailabilityChange(day, 'end', e.target.value)}
                          className="time-input w-full sm:w-auto px-3 py-1.5 border border-neutral rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm bg-base-100"
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
          <div className="step-content space-y-6">
            <h3 className="text-xl font-semibold text-secondary mb-6 text-center md:text-left">Experiencia y Habilidades</h3>
            
            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-secondary mb-1">Años de experiencia *</label>
              <select
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-150 bg-base-100"
              >
                <option value="" disabled>Selecciona tu rango de experiencia</option>
                <option value="menos-1">Menos de 1 año</option>
                <option value="1-3">1-3 años</option>
                <option value="3-5">3-5 años</option>
                <option value="5-10">5-10 años</option>
                <option value="mas-10">Más de 10 años</option>
              </select>
            </div>

            <div>
              <label htmlFor="newSkill" className="block text-sm font-medium text-secondary mb-1">Habilidades específicas *</label>
              <div className="skills-input flex items-center gap-2 mb-3">
                <input
                  id="newSkill"
                  type="text"
                  name="newSkill"
                  value={formData.newSkill}
                  onChange={handleInputChange}
                  placeholder="Ej: Instalación de tuberías, Reparación de fugas"
                  onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); }}}
                  className="flex-grow px-4 py-2.5 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-150 bg-base-100 placeholder-neutral/60"
                />
                <button 
                  type="button" 
                  onClick={addSkill} 
                  className="btn bg-secondary text-white hover:bg-toklen-blue-hover text-sm px-5 py-2.5 rounded-lg transition-colors duration-150"
                >
                  Añadir
                </button>
              </div>
              
              <div className="skills-list flex flex-wrap gap-2 mt-2 min-h-[2.5rem]">
                {formData.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="skill-tag flex items-center gap-1.5 bg-primary/10 text-primary text-xs sm:text-sm font-medium pl-3 pr-2 py-1.5 rounded-full"
                  >
                    {skill}
                    <button 
                      type="button" 
                      onClick={() => removeSkill(skill)}
                      className="remove-skill text-primary hover:text-toklen-coral-hover text-lg font-bold leading-none focus:outline-none"
                      aria-label={`Quitar habilidad ${skill}`}
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              
              {formData.skills.length === 0 && (
                <p className="help-text text-xs text-neutral mt-1">Añade al menos una habilidad. Presiona Enter o "Añadir".</p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-base-200">
        <div className="text-xl text-secondary">Cargando...</div> {/* O un spinner más elaborado */}
      </div>
    );
  }

  return (
    <div className="professional-registration min-h-screen bg-base-200 py-8 md:py-12 px-4">
      <div className="container max-w-3xl mx-auto bg-base-100 p-6 md:p-8 rounded-xl shadow-2xl">
        <div className="registration-header text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-2">Registro de Profesional</h1>
          <p className="text-neutral text-md">Completa tu perfil para empezar a ofrecer tus servicios en Toklen.</p>
          
          {/* Indicador de Pasos con Tailwind */}
          <div className="step-indicator flex justify-between items-center my-8 max-w-md mx-auto">
            {[1, 2, 3].map((step, index, arr) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center">
                  <div
                    className={`step-number w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-lg
                      ${currentStep === step ? 'bg-primary text-white ring-4 ring-primary/30' : ''}
                      ${currentStep > step ? 'bg-green-500 text-white' : ''}
                      ${currentStep < step ? 'bg-neutral/20 text-secondary' : ''}`}
                  >
                    {currentStep > step ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : step}
                  </div>
                  <div className={`step-title text-xs md:text-sm mt-2 font-medium
                    ${currentStep === step ? 'text-primary' : ''}
                    ${currentStep > step ? 'text-green-600' : ''}
                    ${currentStep < step ? 'text-neutral' : ''}`}
                  >
                  {step === 1 && 'Info Básica'}
                  {step === 2 && 'Contacto'}
                  {step === 3 && 'Experiencia'}
                </div>
                </div>
                {index < arr.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 ${currentStep > step ? 'bg-green-500' : 'bg-neutral/20'}`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="registration-form space-y-6">
          {renderStep()}

          {error && 
            <div className="error-message bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md my-4" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          }
          {success && 
            <div className="success-message bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md my-4" role="alert">
              <p className="font-bold">Éxito</p>
              <p>{success}</p>
            </div>
          }

          <div className="form-navigation flex justify-between items-center pt-6 border-t border-neutral/20 mt-8">
            {currentStep > 1 && (
              <button 
                type="button" 
                onClick={prevStep} 
                className="btn bg-neutral/20 text-secondary hover:bg-neutral/30 font-medium py-2 px-6 rounded-lg transition-colors duration-150"
              >
                Anterior
              </button>
            )}
            
            {/* Placeholder para el botón de Anterior para mantener el botón Siguiente a la derecha */}
            {currentStep === 1 && <div className="w-24"></div>}

            {currentStep < 3 ? (
              <button 
                type="button" 
                onClick={nextStep} 
                className="btn bg-primary text-white hover:bg-toklen-coral-hover font-medium py-2 px-6 rounded-lg transition-colors duration-150"
              >
                Siguiente
              </button>
            ) : (
              <button 
                type="submit" 
                disabled={loading} 
                className="btn bg-primary text-white hover:bg-toklen-coral-hover font-medium py-2 px-6 rounded-lg transition-colors duration-150 disabled:opacity-60"
              >
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
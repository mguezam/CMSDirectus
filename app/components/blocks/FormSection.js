'use client';

import {useState} from 'react';

// Blocco "Form": mostra un form dinamico costruito in Directus. Ogni campo
// (testo, email, textarea...) e' definito nella collezione "forms" e arriva
// qui gia' espanso. Le risposte vengono salvate in "form_submissions".
//
// tagline / headline: testi introduttivi
// form:               oggetto con i campi e le impostazioni del form
// background_color:   sfondo della sezione
// headline_color:     colore del titolo
export default function FormSection({tagline, headline, form, background_color, headline_color}) {
    // formData e' un oggetto { nomeCampo: valore }. Viene inizializzato con
    // tutti i campi a stringa vuota, cosi' ogni input e' controllato.
    const [formData, setFormData] = useState(
        () => form.fields.reduce((acc, field) => ({...acc, [field.name]: ''}), {})
    );

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    // Aggiorna il valore del campo corrispondente ogni volta che l'utente
    // digita. Si usa la forma funzionale di setFormData per non perdere
    // aggiornamenti se piu' campi cambiano in rapida successione.
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8055/items/form_submissions', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Submission failed');
            }

            setIsSubmitted(true);
            // Svuota il form per un eventuale secondo invio
            setFormData(form.fields.reduce((acc, field) => ({...acc, [field.name]: ''}), {}));
        } catch (err) {
            console.error(err);
            setError('There was an error submitting your form. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Guardia: se il blocco non ha un form collegato non si mostra nulla.
    // Va dopo gli hook per non violare le regole di React (gli hook devono
    // essere chiamati sempre, nello stesso ordine).
    if (!form || !form.fields) return null;

    return (
        <section className="form-section" style={{"--form-background": background_color}}>
            <div className="container">
                <div className="form-header">
                    {tagline && <p className="tagline">{tagline}</p>}
                    {headline && <h2 style={{"--form-headline": headline_color}}>{headline}</h2>}
                </div>

                {/* Dopo l'invio si sostituisce il form con un messaggio di
                    successo. Il bottone "Submit another response" resetta lo
                    stato e fa ricomparire il form. */}
                {isSubmitted ? (
                    <div className="success-message">
                        <p>{form.success_message || 'Ti ringraziamo.'}</p>
                        <button onClick={() => setIsSubmitted(false)} className="reset-button">
                            Submit another response
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="contact-form">
                        {error && <div className="error-message">{error}</div>}

                        {form.fields.map((field) => (
                            <div className="form-group" key={field.id}>
                                <label htmlFor={field.name}>{field.label}</label>
                                {/* Solo il campo di tipo "textarea" usa
                                    <textarea>, tutti gli altri <input>. */}
                                {field.type === 'textarea' ? (
                                    <textarea
                                        id={field.name}
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        rows="5"
                                        required={field.required}
                                    />
                                ) : (
                                    <input
                                        id={field.name}
                                        type={field.type || 'text'}
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        required={field.required}
                                    />
                                )}
                            </div>
                        ))}

                        <button
                            type="submit"
                            className="submit-button"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : (form.submit_label || 'Submit')}
                        </button>
                    </form>
                )}
            </div>

            <style jsx>{`
                .form-section {
                    background-color: var(--form-background, #151515);
                    padding: 80px 0;
                }

                .container {
                    max-width: 700px;
                    margin: 0 auto;
                    padding: 0 20px;
                }

                .form-header {
                    text-align: center;
                    margin-bottom: 40px;
                }

                h2 {
                    color: var(--form-headline, #151515);
                    font-size: 36px;
                    font-weight: bold;
                    margin-bottom: 20px;
                }

                .description {
                    font-size: 18px;
                    color: #4a5568;
                    line-height: 1.6;
                }

                /* La "card" bianca che contiene gli input. */
                .contact-form {
                    background-color: #ffffff;
                    padding: 40px;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                }

                .form-group {
                    margin-bottom: 20px;
                }

                label {
                    display: block;
                    font-size: 16px;
                    font-weight: 600;
                    color: #2d3748;
                    margin-bottom: 8px;
                }

                input, textarea {
                    width: 100%;
                    padding: 12px;
                    font-size: 16px;
                    border: 1px solid #e2e8f0;
                    border-radius: 4px;
                    color: #2d3748;
                    transition: border-color 0.3s;
                }

                input:focus, textarea:focus {
                    outline: none;
                    border-color: #3182ce;
                }

                .submit-button {
                    display: block;
                    width: 100%;
                    background-color: #3182ce;
                    color: white;
                    border: none;
                    padding: 12px;
                    font-size: 16px;
                    font-weight: 600;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }

                .submit-button:hover:not(:disabled) {
                    background-color: #2b6cb0;
                }

                /* Quando il bottone e' disabilitato (invio in corso) si
                   schiarisce e il cursore diventa "not-allowed". */
                .submit-button:disabled {
                    background-color: #90cdf4;
                    cursor: not-allowed;
                }

                .error-message {
                    background-color: #fed7d7;
                    color: #c53030;
                    padding: 12px;
                    border-radius: 4px;
                    margin-bottom: 20px;
                    font-size: 14px;
                }

                .success-message {
                    text-align: center;
                    background-color: #c6f6d5;
                    padding: 40px;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                }

                .success-message h3 {
                    font-size: 24px;
                    font-weight: 600;
                    color: #2f855a;
                    margin-bottom: 10px;
                }

                .success-message p {
                    font-size: 16px;
                    color: #276749;
                    margin-bottom: 30px;
                }

                .reset-button {
                    background-color: #38a169;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    font-size: 16px;
                    font-weight: 500;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }

                .reset-button:hover {
                    background-color: #2f855a;
                }
            `}</style>
        </section>
    );
}
'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import "./style.css";

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
                    <Card className="success-message gap-0 py-0">
                        <CardContent className="p-10">
                            <p>{form.success_message || 'Ti ringraziamo.'}</p>
                            <Button
                                onClick={() => setIsSubmitted(false)}
                                className="reset-button h-10 px-5 text-base font-medium bg-emerald-600 text-white hover:bg-emerald-700"
                            >
                                Submit another response
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="contact-form gap-0 py-0">
                        <CardContent className="px-5 py-6 sm:px-10 sm:py-10">
                            <form onSubmit={handleSubmit}>
                                {error && <div className="error-message" role="alert">{error}</div>}

                                {form.fields.map((field) => (
                                    <div className="form-group" key={field.id}>
                                        <Label htmlFor={field.name} className="mb-2 block text-base font-semibold text-slate-800">
                                            {field.label}
                                        </Label>
                                        {field.type === 'textarea' ? (
                                            <Textarea
                                                id={field.name}
                                                name={field.name}
                                                value={formData[field.name]}
                                                onChange={handleChange}
                                                rows="5"
                                                required={field.required}
                                                className="text-base"
                                            />
                                        ) : (
                                            <Input
                                                id={field.name}
                                                type={field.type || 'text'}
                                                name={field.name}
                                                value={formData[field.name]}
                                                onChange={handleChange}
                                                required={field.required}
                                                className="h-12 text-base"
                                            />
                                        )}
                                    </div>
                                ))}

                                <Button type="submit" className="h-11 w-full text-base font-semibold" disabled={isSubmitting}>
                                    {isSubmitting ? 'Submitting...' : (form.submit_label || 'Submit')}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}
            </div>

            
        </section>
    );
}
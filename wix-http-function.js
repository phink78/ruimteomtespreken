// Wix HTTP Functions - Quiz Data Opvangen
// Bestand: backend/http-functions.js

import { ok, badRequest, serverError } from 'wix-http-functions';
import wixData from 'wix-data';

/**
 * HTTP Function om quiz data op te vangen en op te slaan in Wix CMS
 * Endpoint: https://jouw-site.wixsite.com/_functions/saveQuizData
 */
export async function post_saveQuizData(request) {
  try {
    // Parse de JSON body
    const data = await request.body.json();
    
    // Valideer verplichte velden
    const requiredFields = ['voornaam', 'achternaam', 'email', 'telefoon', 'situatie', 'gevoel', 'omgang', 'wens'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return badRequest({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Valideer email format
    const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(data.email)) {
      return badRequest({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Bereid data voor om op te slaan in CMS
    const quizResponse = {
      voornaam: data.voornaam,
      achternaam: data.achternaam,
      email: data.email,
      telefoon: data.telefoon,
      situatie: data.situatie,
      gevoel: data.gevoel,
      omgang: data.omgang,
      wens: data.wens,
      timestamp: new Date(data.timestamp || new Date())
    };

    // Sla op in Wix CMS collection "QuizResponses"
    const result = await wixData.insert('QuizResponses', quizResponse);

    console.log('Quiz data opgeslagen:', result._id);

    // Optioneel: Verstuur notificatie email naar jezelf
    // await sendNotificationEmail(quizResponse);

    // Return success response
    return ok({
      success: true,
      message: 'Quiz data successfully saved',
      id: result._id
    });

  } catch (error) {
    console.error('Error saving quiz data:', error);
    
    return serverError({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}

/**
 * OPTIONEEL: Verstuur een notificatie email naar jezelf bij elke nieuwe inzending
 * 
 * Om deze functie te gebruiken:
 * 1. Uncomment de functie hieronder
 * 2. Uncomment de regel "await sendNotificationEmail(quizResponse);" hierboven
 * 3. Installeer wix-crm-backend: In Developer Console > Packages & APIs > Add Package > wix-crm-backend
 */

/*
import { emailContact } from 'wix-crm-backend';

async function sendNotificationEmail(data) {
  const emailOptions = {
    to: 'pepijnja@gmail.com',
    from: {
      email: 'noreply@ruimteomtespreken.nl',
      name: 'Ruimte om te spreken - Quiz'
    },
    subject: `Nieuwe quiz inzending: ${data.voornaam} ${data.achternaam}`,
    body: `
      <h2>Nieuwe Quiz Inzending</h2>
      
      <h3>Contactgegevens:</h3>
      <p><strong>Naam:</strong> ${data.voornaam} ${data.achternaam}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Telefoon:</strong> ${data.telefoon}</p>
      
      <h3>Quiz Antwoorden:</h3>
      <p><strong>Situatie:</strong> ${data.situatie}</p>
      <p><strong>Gevoel:</strong> ${data.gevoel}</p>
      <p><strong>Omgang:</strong> ${data.omgang}</p>
      <p><strong>Wens:</strong> ${data.wens}</p>
      
      <p><strong>Ontvangen op:</strong> ${new Date(data.timestamp).toLocaleString('nl-NL')}</p>
    `
  };

  try {
    await emailContact(emailOptions);
    console.log('Notification email sent');
  } catch (error) {
    console.error('Error sending notification email:', error);
  }
}
*/

/**
 * OPTIONEEL: GET endpoint om quiz data op te halen (voor admin gebruik)
 * Endpoint: https://jouw-site.wixsite.com/_functions/getQuizData
 */

/*
export async function get_getQuizData(request) {
  try {
    // Optioneel: Voeg authenticatie toe hier
    // const authHeader = request.headers.authorization;
    // if (authHeader !== 'Bearer YOUR_SECRET_TOKEN') {
    //   return forbidden({ message: 'Unauthorized' });
    // }

    // Haal alle quiz responses op (max 1000, sorteer op datum)
    const results = await wixData.query('QuizResponses')
      .descending('timestamp')
      .limit(1000)
      .find();

    return ok({
      success: true,
      count: results.items.length,
      data: results.items
    });

  } catch (error) {
    console.error('Error fetching quiz data:', error);
    
    return serverError({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}
*/

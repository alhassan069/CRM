const { OpenAI } = require('openai');
const openaiConfig = require('../config/openai.config');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: openaiConfig.apiKey
});

/**
 * Generate deal coach advice based on lead data
 * @param {Object} lead - Lead data including status, activities, and notes
 * @returns {Promise<string>} - AI-generated advice
 */
async function generateDealCoachAdvice(lead) {
  try {
    console.log(lead);
    const prompt = `
      You are an expert sales coach helping a sales representative convert a doctor lead.
      
      Lead Information:
      - Doctor Name: ${lead.doctor_name || 'Unknown'}
      - Specialty: ${lead.specialty || 'Unknown'}
      - Current Status: ${lead.status ? lead.status.label : 'New Lead'}
      - Time in current status: ${lead.updated_at ? getDaysSinceDate(lead.updated_at) : 'Unknown'} days
      - Number of interactions: ${lead.activities ? lead.activities.length : 0}
      - Pain points: ${lead.specific_pain_points || 'Unknown'}
      
      Based on this information, provide 3 concise, actionable next steps to improve the chances of converting this lead.
      Format your response as a short paragraph followed by 3 bullet points.
      Keep your entire response under 200 words.
    `;

    const response = await openai.chat.completions.create({
      model: openaiConfig.defaultModel,
      messages: [{ role: 'user', content: prompt }],
      temperature: openaiConfig.temperature,
      max_tokens: openaiConfig.maxTokens
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating deal coach advice:', error);
    throw new Error('Failed to generate deal coach advice');
  }
}

/**
 * Generate customer persona based on lead data and interactions
 * @param {Object} lead - Lead data including activities and notes
 * @returns {Promise<Object>} - AI-generated persona with attributes
 */
async function generateCustomerPersona(lead) {
  try {
    // Collect all interaction data
    const activities = lead.Activities || [];
    const activityNotes = activities.map(a => a.full_notes || a.summary).join('\n');
    
    const prompt = `
      You are an expert at analyzing customer data and creating behavioral profiles.
      
      Lead Information:
      - Doctor Name: ${lead.doctor_name || 'Unknown'}
      - Specialty: ${lead.specialty || 'Unknown'}
      - Clinic Type: ${lead.clinic_type || 'Unknown'}
      - Years of Experience: ${lead.years_of_experience || 'Unknown'}
      - Patient Volume: ${lead.estimated_patient_volume || 'Unknown'}
      - Pain Points: ${lead.specific_pain_points || 'Unknown'}
      - Preferred Communication: ${lead.preferred_comm_channel || 'Unknown'}
      
      Interaction History:
      ${activityNotes || 'Limited interaction data available'}
      
      Based on this information, create a behavioral profile with the following attributes:
      1. Communication Preference
      2. Decision-Making Style
      3. Tech Adoption Level
      4. Primary Pain Points
      5. Value Proposition Focus
      
      Format your response as JSON with these 5 attributes as keys and brief descriptions as values.
      If data is insufficient for any attribute, indicate this in your response.
    `;

    const response = await openai.chat.completions.create({
      model: openaiConfig.defaultModel,
      messages: [{ role: 'user', content: prompt }],
      temperature: openaiConfig.temperature,
      max_tokens: openaiConfig.maxTokens,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0].message.content.trim();
    
    // Try to parse JSON from the response
    try {
      // Find JSON in the response if it's wrapped in text
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : content;
      return JSON.parse(jsonStr);
    } catch (parseError) {
      // If parsing fails, return the raw text
      console.warn('Failed to parse JSON from AI response:', parseError);
      return { 
        raw: content,
        error: 'Could not parse structured data'
      };
    }
  } catch (error) {
    console.error('Error generating customer persona:', error);
    throw new Error('Failed to generate customer persona');
  }
}

/**
 * Generate responses to customer objections
 * @param {string} objection - The customer objection text
 * @returns {Promise<Array<string>>} - Array of suggested responses
 */
async function handleObjection(objection) {
  try {
    const prompt = `
      You are an expert sales coach helping a sales representative respond to an objection from a doctor who is considering using our medical software.
      
      The doctor's objection is: "${objection}"
      
      Provide 3 effective, concise responses to this objection. Each response should:
      1. Acknowledge the concern
      2. Provide a counter-point or solution
      3. End with a question that moves the conversation forward
      
      Format your response as a JSON object with 3 keys: response1, response2, response3, each with a value of a bullet point, each under 50 words.
    `;

    const response = await openai.chat.completions.create({
      model: openaiConfig.defaultModel,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: openaiConfig.temperature,
      max_tokens: openaiConfig.maxTokens
    });

    console.log(response);
    console.log(response.choices[0].message.content);

    const content = JSON.parse(response.choices[0].message.content);
    
    return [content.response1, content.response2, content.response3];
  } catch (error) {
    console.error('Error handling objection:', error);
    throw new Error('Failed to generate objection responses');
  }
}

/**
 * Generate win-loss insights based on converted and lost leads
 * @param {Array<Object>} wonLeads - Array of converted leads with their data
 * @param {Array<Object>} lostLeads - Array of lost leads with their data
 * @returns {Promise<Object>} - AI-generated insights
 */
async function generateWinLossInsights(wonLeads, lostLeads) {
  try {
    // Prepare data summaries
    const wonLeadsSummary = wonLeads.map(lead => ({
      source: lead.source_of_lead,
      interactions: lead.Activities ? lead.Activities.length : 0,
      timeToConvert: lead.created_at && lead.updated_at ? 
        getDaysBetweenDates(lead.created_at, lead.updated_at) : 'Unknown',
      painPoints: lead.specific_pain_points || 'Unknown'
    }));
    
    const lostLeadsSummary = lostLeads.map(lead => ({
      source: lead.source_of_lead,
      interactions: lead.Activities ? lead.Activities.length : 0,
      reasonForLoss: lead.reason_for_loss || 'Unknown',
      painPoints: lead.specific_pain_points || 'Unknown'
    }));
    
    const prompt = `
      You are an expert sales analyst helping identify patterns in won and lost deals.
      
      Won Deals (${wonLeads.length}):
      ${JSON.stringify(wonLeadsSummary)}
      
      Lost Deals (${lostLeads.length}):
      ${JSON.stringify(lostLeadsSummary)}
      
      Based on this data, provide insights on:
      1. A summary paragraph of overall patterns
      2. Key factors contributing to wins (3-5 bullet points)
      3. Key factors contributing to losses (3-5 bullet points)
      4. One actionable recommendation to improve conversion rate
      
      If the data is limited, clearly state this but still provide your best analysis.
      Format your response as JSON with keys: summary, winFactors, lossFactors, recommendation.
    `;

    const response = await openai.chat.completions.create({
      model: openaiConfig.defaultModel,
      messages: [{ role: 'user', content: prompt }],
      temperature: openaiConfig.temperature,
      max_tokens: openaiConfig.maxTokens
    });

    const content = response.choices[0].message.content.trim();
    
    // Try to parse JSON from the response
    try {
      // Find JSON in the response if it's wrapped in text
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : content;
      return JSON.parse(jsonStr);
    } catch (parseError) {
      // If parsing fails, return the raw text
      console.warn('Failed to parse JSON from AI response:', parseError);
      return { 
        raw: content,
        error: 'Could not parse structured data'
      };
    }
  } catch (error) {
    console.error('Error generating win-loss insights:', error);
    throw new Error('Failed to generate win-loss insights');
  }
}

/**
 * Helper function to calculate days since a given date
 * @param {Date} date - The date to compare against
 * @returns {number} - Number of days
 */
function getDaysSinceDate(date) {
  const now = new Date();
  const givenDate = new Date(date);
  const diffTime = Math.abs(now - givenDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Helper function to calculate days between two dates
 * @param {Date} startDate - The start date
 * @param {Date} endDate - The end date
 * @returns {number} - Number of days
 */
function getDaysBetweenDates(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

module.exports = {
  generateDealCoachAdvice,
  generateCustomerPersona,
  handleObjection,
  generateWinLossInsights
}; 
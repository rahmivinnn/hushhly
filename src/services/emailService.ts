// emailService.ts
// This service handles sending emails using EmailJS

import emailjs from '@emailjs/browser';

// EmailJS configuration
const SERVICE_ID = 'service_hushhly'; // Replace with your EmailJS service ID
const TEMPLATE_ID_OTP = 'template_otp'; // Replace with your EmailJS template ID for OTP
const PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // Replace with your EmailJS public key

// Initialize EmailJS
emailjs.init(PUBLIC_KEY);

// Generate a random OTP code
export const generateOTP = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Store OTP codes temporarily (in a real app, this would be in a database)
const otpStore: Record<string, { code: string; timestamp: number }> = {};

// Send OTP email
export const sendOTPEmail = async (email: string): Promise<{ success: boolean; otp?: string; error?: string }> => {
  try {
    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP with timestamp (valid for 10 minutes)
    otpStore[email] = {
      code: otp,
      timestamp: Date.now() + 10 * 60 * 1000 // 10 minutes expiry
    };
    
    // For demo purposes, we'll just log the OTP to console
    console.log(`OTP for ${email}: ${otp}`);
    
    // In a real implementation, we would send the email using EmailJS
    // Uncomment the following code and replace with your actual EmailJS configuration
    /*
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID_OTP,
      {
        to_email: email,
        otp_code: otp,
        to_name: email.split('@')[0]
      }
    );
    
    if (response.status !== 200) {
      throw new Error('Failed to send email');
    }
    */
    
    // For demo purposes, we'll simulate a successful email send
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { success: true, otp };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return { success: false, error: 'Failed to send OTP email. Please try again.' };
  }
};

// Verify OTP code
export const verifyOTP = (email: string, code: string): boolean => {
  const storedOTP = otpStore[email];
  
  // Check if OTP exists and is valid
  if (!storedOTP) {
    return false;
  }
  
  // Check if OTP has expired
  if (storedOTP.timestamp < Date.now()) {
    // Remove expired OTP
    delete otpStore[email];
    return false;
  }
  
  // Check if OTP matches
  const isValid = storedOTP.code === code;
  
  // If valid, remove the OTP (one-time use only)
  if (isValid) {
    delete otpStore[email];
  }
  
  return isValid;
};

// Reset password
export const resetPassword = async (email: string, newPassword: string): Promise<boolean> => {
  try {
    // In a real implementation, this would update the password in your authentication system
    // For demo purposes, we'll just simulate a successful password reset
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Store the new password in localStorage (for demo purposes only)
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    userData.password = newPassword;
    localStorage.setItem('user', JSON.stringify(userData));
    
    return true;
  } catch (error) {
    console.error('Error resetting password:', error);
    return false;
  }
};

// Email service object
const emailService = {
  sendOTPEmail,
  verifyOTP,
  resetPassword,
  generateOTP
};

export default emailService;

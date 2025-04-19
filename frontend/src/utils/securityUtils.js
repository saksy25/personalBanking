// utils/securityUtils.js
export const checkPasswordStrength = (password) => {
    let strength = 0;
    const feedback = [];
    
    // Length check
    if (password.length < 8) {
      feedback.push('Password should be at least 8 characters');
    } else {
      strength += 1;
    }
    
    // Uppercase letters check
    if (!/[A-Z]/.test(password)) {
      feedback.push('Add uppercase letters');
    } else {
      strength += 1;
    }
    
    // Lowercase letters check
    if (!/[a-z]/.test(password)) {
      feedback.push('Add lowercase letters');
    } else {
      strength += 1;
    }
    
    // Numbers check
    if (!/[0-9]/.test(password)) {
      feedback.push('Add numbers');
    } else {
      strength += 1;
    }
    
    // Special characters check
    if (!/[^A-Za-z0-9]/.test(password)) {
      feedback.push('Add special characters');
    } else {
      strength += 1;
    }
    
    // Return strength level and feedback
    let strengthText = '';
    if (strength < 2) {
      strengthText = 'Weak';
    } else if (strength < 4) {
      strengthText = 'Medium';
    } else {
      strengthText = 'Strong';
    }
    
    return {
      score: strength,
      level: strengthText,
      feedback,
    };
  };
  
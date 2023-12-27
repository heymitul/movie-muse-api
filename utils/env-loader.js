const loadSecrets = async (config) => {
    const {
      configFilePath
    } = config;
  
    try {
      const fs = require('fs').promises;
  
      let secrets = await fs.readFile(configFilePath, 'utf8');
      secrets = JSON.parse(secrets);
  
      const keys = Object.keys(secrets);
      for (const key of keys) {
        if (typeof secrets[key] === 'object') {
          process.env[key] = JSON.stringify(secrets[key]);
          continue;
        }
  
        process.env[key] = secrets[key];
      }
    } catch (error) {
      throw error;
    }
  };
  
  module.exports = loadSecrets;
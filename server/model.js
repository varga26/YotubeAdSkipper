// models.js
import { DataTypes } from 'sequelize';

/**
 * Definition of the AdSegment model
 */
export default (sequelize) => {
  const AdSegment = sequelize.define('AdSegment', {
    // videoId TEXT PRIMARY KEY
    // Unique identifier of the YouTube video
    videoId: {
      type: DataTypes.TEXT,
      primaryKey: true,
      allowNull: false,
    },

    // segments TEXT (Stored as JSON string)
    // Contains an array of detected ad segments
    segments: {
      type: DataTypes.TEXT,

      // Allow NULL in DB, even though the setter will normally store "[]"
      allowNull: true, 
      
      // Getter — automatically parses JSON when reading from the database
      get() {
        const rawValue = this.getDataValue('segments');

        // If the value is NULL or invalid JSON, return an empty array
        try {
            return rawValue ? JSON.parse(rawValue) : [];
        } catch (e) {
            console.error("Error parsing segments JSON:", rawValue);
            return []; // Safe fallback on JSON parse error
        }
      },
      
      // Setter — automatically converts the value to JSON before saving
      set(value) {
        // If the LLM returned null or undefined, convert to empty array
        // Then store as "[]"
        const finalValue = value || []; 
        this.setDataValue('segments', JSON.stringify(finalValue));
      }
    }
  }, {
    // Explicit table name
    tableName: 'ads',
    
    // Disable createdAt / updatedAt timestamps
    timestamps: false
  });

  return AdSegment;
};

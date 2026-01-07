import cron from 'node-cron';
import Scholarship from '../models/Scholarship';
import Notification from '../models/Notification';
import User from '../models/User';

// Runs every day at 00:00 (Midnight)
cron.schedule('0 0 * * *', async () => {
  const twoDaysFromNow = new Date();
  twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
  
  // Set range for the entire day two days from now
  const startOfDay = new Date(twoDaysFromNow.setHours(0,0,0,0));
  const endOfDay = new Date(twoDaysFromNow.setHours(23,59,59,999));

  const expiringScholarships = await Scholarship.find({
    deadline: { $gte: startOfDay, $lte: endOfDay }
  });

  for (const scholarship of expiringScholarships) {
    // Notify all students (or only those who haven't applied yet)
    const students = await User.find({ role: 'student' });
    
    const reminders = students.map(student => ({
      recipientId: student._id,
      title: 'Deadline Approaching!',
      message: `The scholarship "${scholarship.name}" expires in 2 days. Don't miss out!`,
      type: 'DEADLINE'
    }));

    await Notification.insertMany(reminders);
  }
  console.log('Deadline reminders processed.');
});
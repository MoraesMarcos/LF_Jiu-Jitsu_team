import { ref, computed, onMounted } from 'vue';

const classes = ref([]);
const selectedDate = ref(new Date().toISOString().split('T')[0]);

function getNextSevenDays() {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

function generateMockClasses() {
  const days = getNextSevenDays();
  const mocks = [];
  days.forEach(day => {
    mocks.push({
      id: `aula-${day}-1900`,
      name: 'Jiu-Jitsu Adulto',
      coach: 'Mestre Silva',
      date: day,
      time: '19:00',
      start: `${day}T19:00:00`,
      end: `${day}T20:30:00`,
      capacity: 20,
      attendees: [],
      classType: 'Adulto'
    });
    mocks.push({
      id: `aula-${day}-1700`,
      name: 'Jiu-Jitsu Kids',
      coach: 'Instrutora Ana',
      date: day,
      time: '17:00',
      start: `${day}T17:00:00`,
      end: `${day}T18:00:00`,
      capacity: 15,
      attendees: [],
      classType: 'Kids'
    });
  });
  classes.value = mocks;
}

export function useBookings(currentUserId) {

  onMounted(() => {
    if (classes.value.length === 0) generateMockClasses();
  });

  const days = computed(() => getNextSevenDays());

  const listByDate = computed(() => {
    return classes.value.filter(c => c.date === selectedDate.value)
      .sort((a, b) => a.time.localeCompare(b.time));
  });

  const getById = (id) => classes.value.find(c => c.id === id);
  const attendeesCount = (id) => getById(id)?.attendees?.length || 0;
  const isBooked = (id) => (getById(id)?.attendees || []).includes(currentUserId);

  const hasActiveBooking = (userId) => classes.value.some(c => c.attendees.includes(userId));

  const hasCapacity = (classType, date, time) => {
    const session = classes.value.find(c => c.classType === classType && c.date === date && c.time === time);
    if (!session) return true;
    return (session.attendees.length < (session.capacity || 20));
  };

  const getPreviousBookings = async () => [];

  const replaceSession = async (session) => {
    const index = classes.value.findIndex(c => c.id === session.id);
    if (index !== -1) {
      // Simula a lógica de toggle localmente
      const attendees = classes.value[index].attendees;
      if (attendees.includes(currentUserId)) {
        const idx = attendees.indexOf(currentUserId);
        attendees.splice(idx, 1);
      } else {
        attendees.push(currentUserId);
      }
    }
    return { ok: true };
  };

  return {
    days,
    selectedDate,
    listByDate,
    attendeesCount,
    isBooked,
    getById,
    replaceSession,
    hasActiveBooking,
    hasCapacity,
    getPreviousBookings
  };
}
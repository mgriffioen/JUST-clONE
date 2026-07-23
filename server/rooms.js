const { Room, MAX_PLAYERS } = require('./game');

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I to avoid confusion
const ROOM_TTL_MS = 6 * 60 * 60 * 1000; // clean up rooms idle for 6h

class RoomManager {
  constructor() {
    this.rooms = new Map();
    setInterval(() => this.sweep(), 30 * 60 * 1000).unref();
  }

  generateCode() {
    let code;
    do {
      code = Array.from({ length: 4 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join('');
    } while (this.rooms.has(code));
    return code;
  }

  create(totalRounds) {
    const code = this.generateCode();
    const room = new Room(code, totalRounds);
    this.rooms.set(code, room);
    return room;
  }

  get(code) {
    return this.rooms.get(String(code || '').toUpperCase());
  }

  remove(code) {
    this.rooms.delete(code);
  }

  sweep() {
    const now = Date.now();
    for (const [code, room] of this.rooms.entries()) {
      if (now - room.lastActivity > ROOM_TTL_MS) this.rooms.delete(code);
    }
  }
}

module.exports = { RoomManager, MAX_PLAYERS };

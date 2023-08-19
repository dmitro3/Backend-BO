const sharp = require('sharp');
//const { v4: uuidv4 } = require('uuid')
const path = require('path');
const db = require("../../database");
var md5 = require("md5");

class Resize {
  
  constructor(folder) {
    this.folder = folder
  }
  async save(buffer, nick) {
    
    const filename = Resize.filename(nick);
    const filepath = this.filepath(filename);
   
    await sharp(buffer)
      .resize(150, 150, { // size image 150x150
        fit: sharp.fit.inside,
        withoutEnlargement: true
      })
      .toFile(filepath);
    
    return filename;
  }
  async savePassPortFront(buffer, nick) {
    
    const filename = Resize.filenameFront(nick);
    const filepath = this.filepath(filename);

    await sharp(buffer).toFile(filepath);
    return filename;
  }
  async savePassPortBack(buffer, nick) {
    
    const filename = Resize.filenameBack(nick);
    const filepath = this.filepath(filename);

    await sharp(buffer).toFile(filepath);
    return filename;
  }
  static filename(nick) {

    let name = `${nick}.png`
    name = md5(name+nick)+ '.png';

    db.query(
      `UPDATE users SET profile_image = ? WHERE nick_name = ?`,
      [
          name,
          nick
      ], (error, results, fields) => {
          if(error){
              return error;
          }
      }
   )
    return name;
  }
  static filenameFront(nick) {
    let name = `id_front_${nick}.png`
    name = md5(name+nick)+ '.png';

    db.query(
      `UPDATE users SET id_front = ? WHERE nick_name = ?`,
      [
          name,
          nick
      ], (error, results, fields) => {
          if(error){
              return error;
          }
      }
   )
    return name;
  }
  static filenameBack(nick) {
    let name = `id_back_${nick}.png`
    name = md5(name+nick)+ '.png';

    db.query(
      `UPDATE users SET id_back = ? WHERE nick_name = ?`,
      [
          name,
          nick
      ], (error, results, fields) => {
          if(error){
              return error;
          }
      }
   )
    return name;
 }
  filepath(filename) {

    return path.resolve(`${this.folder}/${filename}`)
  }
}
module.exports = Resize;
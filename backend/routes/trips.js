"use strict";

/** Routes for trips. */

const jsonschema = require("jsonschema");
const express = require("express");
const multer = require("multer");
const AWS = require("aws-sdk");
const path = require("path");

const { BadRequestError } = require("../expressError");
const { ACCESS_KEY_ID, SECRET_ACCESS_KEY } = require("../secret");
const Trip = require("../models/trip");

const tripNewSchema = require("../schemas/tripNew.json");

const router = new express.Router();

AWS.config.update({
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
  region: 'us-east-2'
})

// Set up Multer for file uploads
const s3 = new AWS.S3();
const storage = multer.memoryStorage();

const upload = multer({storage: storage});

/** POST / { trip } =>  { trip }
 *
 * trip should be { title, userId }
 *
 * Returns { id, title, userId }
 */

router.post("/", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, tripNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const trip = await Trip.create(req.body);
    return res.status(201).json({ trip });
  } catch (err) {
    return next(err);
  }
});

/** GET /  =>
 *   { trips: [ { id, title, userId }, ...] }
 *
 *
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
  try {

    const trips = await Trip.findAll();
    return res.json({ trips });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id]  =>  { trip }
 *
 *  trip is { id, title, userId, images }
 *  where images is [{id, fileName, filePath, caption, tag1, tag2, tag3}, ...]
 *
 * Authorization required: none
 */

router.get("/:id", async function (req, res, next) {
  try {
    const trip = await Trip.get(req.params.id);
    return res.json({ trip });
  } catch (err) {
    return next(err);
  }
});

/** POST /[id] { fld1, fld2, ... } => { trip }
 *
 * Add image to trip
 *
 * fields can be: { file, caption, tag1, tag2, tag3}
 *
 * Returns { imageId }
 */

router.post("/:id", upload.single('file'), async function (req, res, next) {
  
  const file = req.file;

  // Check if file exists
  if (!file) {
    return res.status(400).send('No file uploaded.');
  }
  // Check if caption exists
  if(!req.caption) {
    return res.status(400).send('No caption for file.');
  }

  // Check if file has the required properties
  if (!file.originalname || !file.buffer || !file.mimetype) {
    return res.status(400).send('Uploaded file is missing required properties.');
  }

  const params = {
    Bucket: 'traveler-capstone-images',
    Key: file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype
  };

  // Upload the file to S3
  s3.upload(params, async (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error uploading image to S3');
    }

    try {
      let imageData = {
                      file_url: data.Location,
                      caption: req.caption
      }
      await Trip.addImage(req.params.id, imageData);
      res.send(`File uploaded successfully. URL: ${data.Location}`);
    } catch (err) {
      return next(err);
    }

    
  });
  
  
  

});

/** GET /[id]/images => {images: []}
 * 
 * Get all images associated with a trip.
 * 
 * Returns { images }
 */

router.get("/:id/images", async function (req, res, next) {
  try {
    const images = await Trip.getTripImages(req.params.id);
    return res.json({ images });

  } catch(err) {
    return next(err);
  }
})

/** DELETE /[id]  =>  { deleted: id }
 *
 */
router.delete("/:id", async function (req, res, next) {
  try {
    await Trip.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;

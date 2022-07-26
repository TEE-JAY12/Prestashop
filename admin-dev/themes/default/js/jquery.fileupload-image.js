/*
 * jQuery File Upload Image Preview & Resize Plugin 1.3.1
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2013, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/* jslint nomen: true, unparam: true, regexp: true */
/* global define, window, document, DataView, Blob, Uint8Array */

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // Register as an anonymous AMD module:
    define([
      'jquery',
      'load-image',
      'load-image-meta',
      'load-image-exif',
      'load-image-ios',
      'canvas-to-blob',
      './jquery.fileupload-process',
    ], factory);
  } else {
    // Browser globals:
    factory(
      window.jQuery,
      window.loadImage,
    );
  }
}(($, loadImage) => {
  // Prepend to the default processQueue:
  $.blueimp.fileupload.prototype.options.processQueue.unshift(
    {
      action: 'loadImageMetaData',
      disableImageHead: '@',
      disableExif: '@',
      disableExifThumbnail: '@',
      disableExifSub: '@',
      disableExifGps: '@',
      disabled: '@disableImageMetaDataLoad',
    },
    {
      action: 'loadImage',
      // Use the action as prefix for the "@" options:
      prefix: true,
      fileTypes: '@',
      maxFileSize: '@',
      noRevoke: '@',
      disabled: '@disableImageLoad',
    },
    {
      action: 'resizeImage',
      // Use "image" as prefix for the "@" options:
      prefix: 'image',
      maxWidth: '@',
      maxHeight: '@',
      minWidth: '@',
      minHeight: '@',
      crop: '@',
      orientation: '@',
      disabled: '@disableImageResize',
    },
    {
      action: 'saveImage',
      disabled: '@disableImageResize',
    },
    {
      action: 'saveImageMetaData',
      disabled: '@disableImageMetaDataSave',
    },
    {
      action: 'resizeImage',
      // Use "preview" as prefix for the "@" options:
      prefix: 'preview',
      maxWidth: '@',
      maxHeight: '@',
      minWidth: '@',
      minHeight: '@',
      crop: '@',
      orientation: '@',
      thumbnail: '@',
      canvas: '@',
      disabled: '@disableImagePreview',
    },
    {
      action: 'setImage',
      name: '@imagePreviewName',
      disabled: '@disableImagePreview',
    },
  );

  // The File Upload Resize plugin extends the fileupload widget
  // with image resize functionality:
  $.widget('blueimp.fileupload', $.blueimp.fileupload, {

    options: {
      // The regular expression for the types of images to load:
      // matched against the file type:
      loadImageFileTypes: /^image\/(gif|jpeg|png)$/,
      // The maximum file size of images to load:
      loadImageMaxFileSize: 10000000, // 10MB
      // The maximum width of resized images:
      imageMaxWidth: 1920,
      // The maximum height of resized images:
      imageMaxHeight: 1080,
      // Defines the image orientation (1-8) or takes the orientation
      // value from Exif data if set to true:
      imageOrientation: false,
      // Define if resized images should be cropped or only scaled:
      imageCrop: false,
      // Disable the resize image functionality by default:
      disableImageResize: true,
      // The maximum width of the preview images:
      previewMaxWidth: 80,
      // The maximum height of the preview images:
      previewMaxHeight: 80,
      // Defines the preview orientation (1-8) or takes the orientation
      // value from Exif data if set to true:
      previewOrientation: true,
      // Create the preview using the Exif data thumbnail:
      previewThumbnail: true,
      // Define if preview images should be cropped or only scaled:
      previewCrop: false,
      // Define if preview images should be resized as canvas elements:
      previewCanvas: true,
    },

    processActions: {

      // Loads the image given via data.files and data.index
      // as img element, if the browser supports the File API.
      // Accepts the options fileTypes (regular expression)
      // and maxFileSize (integer) to limit the files to load:
      loadImage(data, options) {
        if (options.disabled) {
          return data;
        }
        const that = this;
        const file = data.files[data.index];
        const dfd = $.Deferred();

        if (($.type(options.maxFileSize) === 'number'
                            && file.size > options.maxFileSize)
                        || (options.fileTypes
                            && !options.fileTypes.test(file.type))
                        || !loadImage(
                          file,
                          (img) => {
                            if (img.src) {
                              data.img = img;
                            }
                            dfd.resolveWith(that, [data]);
                          },
                          options,
                        )) {
          return data;
        }
        return dfd.promise();
      },

      // Resizes the image given as data.canvas or data.img
      // and updates data.canvas or data.img with the resized image.
      // Also stores the resized image as preview property.
      // Accepts the options maxWidth, maxHeight, minWidth,
      // minHeight, canvas and crop:
      resizeImage(data, options) {
        if (options.disabled || !(data.canvas || data.img)) {
          return data;
        }
        options = $.extend({canvas: true}, options);
        const that = this;
        const dfd = $.Deferred();
        const img = (options.canvas && data.canvas) || data.img;
        const resolve = function (newImg) {
          if (newImg && (newImg.width !== img.width
                                || newImg.height !== img.height)) {
            data[newImg.getContext ? 'canvas' : 'img'] = newImg;
          }
          data.preview = newImg;
          dfd.resolveWith(that, [data]);
        };
        let thumbnail;

        if (data.exif) {
          if (options.orientation === true) {
            options.orientation = data.exif.get('Orientation');
          }
          if (options.thumbnail) {
            thumbnail = data.exif.get('Thumbnail');
            if (thumbnail) {
              loadImage(thumbnail, resolve, options);
              return dfd.promise();
            }
          }
        }
        if (img) {
          resolve(loadImage.scale(img, options));
          return dfd.promise();
        }
        return data;
      },

      // Saves the processed image given as data.canvas
      // inplace at data.index of data.files:
      saveImage(data, options) {
        if (!data.canvas || options.disabled) {
          return data;
        }
        const that = this;
        const file = data.files[data.index];
        const {name} = file;
        const dfd = $.Deferred();
        const callback = function (blob) {
          if (!blob.name) {
            if (file.type === blob.type) {
              blob.name = file.name;
            } else if (file.name) {
              blob.name = file.name.replace(
                /\..+$/,
                `.${blob.type.substr(6)}`,
              );
            }
          }
          // Store the created blob at the position
          // of the original file in the files list:
          data.files[data.index] = blob;
          dfd.resolveWith(that, [data]);
        };

        // Use canvas.mozGetAsFile directly, to retain the filename, as
        // Gecko doesn't support the filename option for FormData.append:
        if (data.canvas.mozGetAsFile) {
          callback(data.canvas.mozGetAsFile(
            (/^image\/(jpeg|png)$/.test(file.type) && name)
                            || `${(name && name.replace(/\..+$/, ''))
                                || 'blob'}.png`,
            file.type,
          ));
        } else if (data.canvas.toBlob) {
          data.canvas.toBlob(callback, file.type);
        } else {
          return data;
        }
        return dfd.promise();
      },

      loadImageMetaData(data, options) {
        if (options.disabled) {
          return data;
        }
        const that = this;
        const dfd = $.Deferred();
        loadImage.parseMetaData(data.files[data.index], (result) => {
          $.extend(data, result);
          dfd.resolveWith(that, [data]);
        }, options);
        return dfd.promise();
      },

      saveImageMetaData(data, options) {
        if (!(data.imageHead && data.canvas
                        && data.canvas.toBlob && !options.disabled)) {
          return data;
        }
        const file = data.files[data.index];
        const blob = new Blob([
          data.imageHead,
          // Resized images always have a head size of 20 bytes,
          // including the JPEG marker and a minimal JFIF header:
          this._blobSlice.call(file, 20),
        ], {type: file.type});
        blob.name = file.name;
        data.files[data.index] = blob;
        return data;
      },

      // Sets the resized version of the image as a property of the
      // file object, must be called after "saveImage":
      setImage(data, options) {
        if (data.preview && !options.disabled) {
          data.files[data.index][options.name || 'preview'] = data.preview;
        }
        return data;
      },

    },

  });
}));

import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { uploadToCloudinary, uploadVideoToCloudinary, uploadFileToCloudinary } from '../../lib/cloudinary/service';

const RichTextEditor = ({ initialValue, onEditorChange }) => {
    const editorRef = useRef(null);

    // Image upload handler
    const images_upload_handler = (blobInfo, progress) => new Promise((resolve, reject) => {
        uploadToCloudinary(blobInfo.blob())
            .then((url) => {
                resolve(url);
            })
            .catch((err) => {
                reject('Image upload failed: ' + err.message);
            });
    });

    // File picker for images, videos, and files
    const file_picker_callback = (callback, value, meta) => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');

        if (meta.filetype === 'image') {
            input.setAttribute('accept', 'image/*');
        } else if (meta.filetype === 'media') {
            input.setAttribute('accept', 'video/*,audio/*');
        } else if (meta.filetype === 'file') {
            input.setAttribute('accept', '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar');
        }

        input.onchange = async function () {
            const file = this.files[0];

            try {
                let url;
                if (meta.filetype === 'image') {
                    url = await uploadToCloudinary(file);
                } else if (meta.filetype === 'media') {
                    // Upload video to Cloudinary
                    url = await uploadVideoToCloudinary(file);
                } else {
                    // Upload PDF/files to Cloudinary
                    url = await uploadFileToCloudinary(file);
                }

                callback(url, { title: file.name });
            } catch (err) {
                alert('Upload failed: ' + err.message);
            }
        };

        input.click();
    };

    // Custom button to upload PDF/files
    const setupCustomButtons = (editor) => {
        editor.ui.registry.addButton('uploadfile', {
            icon: 'document-properties',
            tooltip: 'Upload PDF/Document',
            onAction: function () {
                const input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar');

                input.onchange = async function () {
                    const file = this.files[0];
                    try {
                        const url = await uploadFileToCloudinary(file);
                        // Insert as a link
                        editor.insertContent(`<a href="${url}" target="_blank">${file.name}</a>`);
                    } catch (err) {
                        alert('Upload failed: ' + err.message);
                    }
                };

                input.click();
            }
        });

        // Custom button to upload video from local
        editor.ui.registry.addButton('uploadvideo', {
            icon: 'embed',
            tooltip: 'Upload Video from Computer',
            onAction: function () {
                const input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', 'video/*');

                input.onchange = async function () {
                    const file = this.files[0];
                    try {
                        const url = await uploadVideoToCloudinary(file);
                        editor.insertContent(`<video controls width="100%" style="max-width: 800px;"><source src="${url}" type="${file.type}">Your browser does not support video.</video>`);
                    } catch (err) {
                        alert('Video upload failed: ' + err.message);
                    }
                };

                input.click();
            }
        });
    };

    return (
        <Editor
            // Use self-hosted TinyMCE - NO API KEY NEEDED!
            tinymceScriptSrc="/tinymce/tinymce.min.js"
            licenseKey="gpl"
            onInit={(evt, editor) => editorRef.current = editor}
            initialValue={initialValue}
            init={{
                height: 700,
                menubar: 'file edit view insert format tools table help',

                // ALL FREE PLUGINS ENABLED
                plugins: [
                    'accordion',      // Accordion/collapsible sections
                    'advlist',        // Advanced lists
                    'anchor',         // Anchor links
                    'autolink',       // Auto-detect links
                    'autoresize',     // Auto-resize editor
                    'autosave',       // Auto-save drafts
                    'charmap',        // Special characters
                    'code',           // Source code view
                    'codesample',     // Code snippets with syntax highlighting
                    'directionality', // RTL/LTR text
                    'emoticons',      // Emoji picker
                    'fullscreen',     // Fullscreen mode
                    'help',           // Help dialog
                    'image',          // Image insertion
                    'importcss',      // Import CSS
                    'insertdatetime', // Date/time insertion
                    'link',           // Hyperlinks
                    'lists',          // Lists
                    'media',          // Video/audio embedding
                    'nonbreaking',    // Non-breaking spaces
                    'pagebreak',      // Page breaks
                    'preview',        // Preview content
                    'quickbars',      // Quick formatting toolbar
                    'save',           // Save button
                    'searchreplace',  // Find and replace
                    'table',          // Tables
                    'visualblocks',   // Show block elements
                    'visualchars',    // Show special characters
                    'wordcount',      // Word count
                ],

                // FULL TOOLBAR WITH ALL FEATURES
                toolbar: [
                    'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | forecolor backcolor',
                    'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media uploadvideo uploadfile table',
                    'accordion codesample charmap emoticons | fullscreen preview code | removeformat help'
                ].join(' | '),

                // Custom buttons setup
                setup: setupCustomButtons,

                // Menu configuration
                menu: {
                    file: { title: 'File', items: 'newdocument restoredraft | preview | print' },
                    edit: { title: 'Edit', items: 'undo redo | cut copy paste pastetext | selectall | searchreplace' },
                    view: { title: 'View', items: 'code | visualaid visualchars visualblocks | fullscreen preview' },
                    insert: { title: 'Insert', items: 'image link media codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor insertdatetime' },
                    format: { title: 'Format', items: 'bold italic underline strikethrough superscript subscript codeformat | blocks fontfamily fontsize align lineheight | forecolor backcolor | language | removeformat' },
                    tools: { title: 'Tools', items: 'wordcount' },
                    table: { title: 'Table', items: 'inserttable | cell row column | advtablesort | tableprops deletetable' },
                    help: { title: 'Help', items: 'help' }
                },

                // Quick toolbar for images - FULL CONTROLS
                quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
                quickbars_insert_toolbar: 'quickimage quicktable',

                // IMAGE SETTINGS - FULL CONTROL (URL + Upload both work)
                images_upload_handler: images_upload_handler,
                automatic_uploads: true,
                image_caption: true,
                image_advtab: true,
                image_title: true,
                image_description: true,
                image_dimensions: true,
                image_uploadtab: true,  // Show upload tab
                // Allow empty src for URL input
                images_reuse_filename: true,
                // Image alignment classes
                image_class_list: [
                    { title: 'None', value: '' },
                    { title: 'Left', value: 'img-left' },
                    { title: 'Center', value: 'img-center' },
                    { title: 'Right', value: 'img-right' },
                    { title: 'Full Width', value: 'img-full' },
                    { title: 'Small', value: 'img-small' },
                    { title: 'Medium', value: 'img-medium' },
                    { title: 'Large', value: 'img-large' },
                ],

                // FILE PICKER - For videos, PDFs, etc.
                file_picker_callback: file_picker_callback,
                file_picker_types: 'image media file',

                // MEDIA SETTINGS - Video/Audio
                media_alt_source: true,
                media_poster: true,
                media_dimensions: true,
                media_live_embeds: true,

                // TABLE SETTINGS - CUSTOM SIZES (up to 40x40)
                table_advtab: true,
                table_cell_advtab: true,
                table_row_advtab: true,
                table_responsive_width: true,
                table_default_attributes: {
                    border: '1'
                },
                table_default_styles: {
                    width: '100%',
                    borderCollapse: 'collapse'
                },
                table_sizing_mode: 'responsive',
                table_column_resizing: 'resizetable',
                // Custom table grid size (default is 10x10, increasing to 40x40)
                table_grid: true,
                table_use_colgroups: true,
                // Table class options
                table_class_list: [
                    { title: 'None', value: '' },
                    { title: 'Bordered', value: 'table-bordered' },
                    { title: 'Striped', value: 'table-striped' },
                    { title: 'Hover', value: 'table-hover' },
                    { title: 'Compact', value: 'table-compact' },
                ],

                // Code sample languages
                codesample_languages: [
                    { text: 'HTML/XML', value: 'markup' },
                    { text: 'JavaScript', value: 'javascript' },
                    { text: 'CSS', value: 'css' },
                    { text: 'PHP', value: 'php' },
                    { text: 'Ruby', value: 'ruby' },
                    { text: 'Python', value: 'python' },
                    { text: 'Java', value: 'java' },
                    { text: 'C', value: 'c' },
                    { text: 'C#', value: 'csharp' },
                    { text: 'C++', value: 'cpp' },
                    { text: 'SQL', value: 'sql' },
                    { text: 'Bash', value: 'bash' },
                    { text: 'JSON', value: 'json' },
                ],

                // Dark theme
                skin: "oxide-dark",
                content_css: "dark",

                // Styling with image/video positioning classes
                content_style: `
                    body { 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; 
                        font-size: 16px; 
                        line-height: 1.6;
                        color: #e0e0e0;
                        background-color: #1a1a2e;
                        padding: 20px;
                    }
                    /* Image positioning */
                    img { max-width: 100%; height: auto; display: block; margin: 10px 0; }
                    img.img-left { float: left; margin-right: 20px; margin-bottom: 10px; }
                    img.img-center { display: block; margin: 20px auto; }
                    img.img-right { float: right; margin-left: 20px; margin-bottom: 10px; }
                    img.img-full { width: 100%; }
                    img.img-small { max-width: 200px; }
                    img.img-medium { max-width: 400px; }
                    img.img-large { max-width: 800px; }
                    /* Video styling */
                    video, iframe { max-width: 100%; display: block; margin: 20px auto; }
                    /* Table styles */
                    table { border-collapse: collapse; width: 100%; margin: 20px 0; }
                    th, td { border: 1px solid #444; padding: 12px; }
                    th { background: #2a2a4a; font-weight: bold; }
                    table.table-bordered { border: 2px solid #6366f1; }
                    table.table-striped tr:nth-child(even) { background: #1f1f3a; }
                    table.table-hover tr:hover { background: #2a2a4a; }
                    table.table-compact td, table.table-compact th { padding: 6px; }
                    /* Other */
                    pre { background: #0d0d1a; padding: 15px; border-radius: 8px; overflow-x: auto; }
                    code { background: #0d0d1a; padding: 2px 6px; border-radius: 4px; }
                    blockquote { border-left: 4px solid #6366f1; padding-left: 20px; margin-left: 0; color: #a0a0a0; }
                    a { color: #6366f1; }
                `,

                // Autosave settings
                autosave_interval: '30s',
                autosave_prefix: 'tinymce-autosave-{path}{query}-{id}-',
                autosave_restore_when_empty: true,

                // Resize
                resize: true,
                min_height: 500,

                // Formats
                block_formats: 'Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Heading 5=h5; Heading 6=h6; Preformatted=pre; Blockquote=blockquote',

                // Font options
                font_family_formats: 'Arial=arial,helvetica,sans-serif; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Tahoma=tahoma,arial,helvetica,sans-serif; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Roboto=roboto; Open Sans=open sans',
                font_size_formats: '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt 72pt',

                // Promotion disabled (no upgrade prompts)
                promotion: false,
                branding: false,

                // Allow all elements and attributes for full control
                extended_valid_elements: 'img[class|src|border|alt|title|width|height|style|align],' +
                    'video[class|src|controls|width|height|poster|autoplay|loop|muted|style],' +
                    'iframe[src|width|height|frameborder|allowfullscreen|style],' +
                    'a[href|target|title|class|style]',

                // Object resizing
                object_resizing: true,
                resize_img_proportional: true,
            }}
            onEditorChange={onEditorChange}
        />
    );
};

export default RichTextEditor;



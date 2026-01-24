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
                console.error('Image upload error:', err);
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
            if (!file) return;

            try {
                let url;
                if (meta.filetype === 'image') {
                    url = await uploadToCloudinary(file);
                } else if (meta.filetype === 'media') {
                    url = await uploadVideoToCloudinary(file);
                } else {
                    url = await uploadFileToCloudinary(file);
                }
                callback(url, { title: file.name });
            } catch (err) {
                console.error('Upload error:', err);
                alert('Upload failed: ' + err.message);
            }
        };

        input.click();
    };

    // Custom buttons setup
    const setupCustomButtons = (editor) => {
        // Upload file button
        editor.ui.registry.addButton('uploadfile', {
            icon: 'document-properties',
            tooltip: 'Upload PDF/Document',
            onAction: function () {
                const input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar');

                input.onchange = async function () {
                    const file = this.files[0];
                    if (!file) return;

                    try {
                        const url = await uploadFileToCloudinary(file);
                        editor.insertContent(`<a href="${url}" target="_blank" rel="noopener noreferrer">${file.name}</a>`);
                    } catch (err) {
                        console.error('File upload error:', err);
                        alert('Upload failed: ' + err.message);
                    }
                };

                input.click();
            }
        });

        // Upload video button
        editor.ui.registry.addButton('uploadvideo', {
            icon: 'embed',
            tooltip: 'Upload Video from Computer',
            onAction: function () {
                const input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', 'video/*');

                input.onchange = async function () {
                    const file = this.files[0];
                    if (!file) return;

                    try {
                        const url = await uploadVideoToCloudinary(file);
                        editor.insertContent(`<video controls width="100%" style="max-width: 800px;"><source src="${url}" type="${file.type}">Your browser does not support video.</video>`);
                    } catch (err) {
                        console.error('Video upload error:', err);
                        alert('Video upload failed: ' + err.message);
                    }
                };

                input.click();
            }
        });

        // Drag and drop functionality
        const enforceLtr = () => {
            const doc = editor.getDoc();
            const body = editor.getBody();

            if (doc?.documentElement) {
                doc.documentElement.setAttribute('dir', 'ltr');
                doc.documentElement.style.direction = 'ltr';
                doc.documentElement.style.unicodeBidi = 'normal';
                doc.documentElement.style.textAlign = 'left';
            }

            if (body) {
                body.setAttribute('dir', 'ltr');
                body.style.direction = 'ltr';
                body.style.unicodeBidi = 'normal';
                body.style.textAlign = 'left';
            }

            const currentNode = editor.selection?.getNode?.();
            if (currentNode && currentNode.nodeType === 1) {
                const element = currentNode;
                element.setAttribute('dir', 'ltr');
                element.style.direction = 'ltr';
                element.style.unicodeBidi = 'normal';
                element.style.textAlign = 'left';
            }
        };

        editor.on('init', function () {
            const editorDocRoot = editor.getDoc()?.documentElement;
            const editorBodyRoot = editor.getBody();

            if (editorDocRoot) {
                editorDocRoot.setAttribute('dir', 'ltr');
                editorDocRoot.style.direction = 'ltr';
                editorDocRoot.style.unicodeBidi = 'normal';
                editorDocRoot.style.textAlign = 'left';
            }

            if (editorBodyRoot) {
                editorBodyRoot.setAttribute('dir', 'ltr');
                editorBodyRoot.style.direction = 'ltr';
                editorBodyRoot.style.unicodeBidi = 'normal';
                editorBodyRoot.style.textAlign = 'left';
            }

            const editorBody = editor.getBody();
            const editorDoc = editor.getDoc();

            let isDragging = false;
            let draggedElement = null;
            let placeholder = null;
            let clone = null;
            let offsetX = 0;
            let offsetY = 0;

            const createClone = (element) => {
                const rect = element.getBoundingClientRect();
                const newClone = element.cloneNode(true);
                newClone.style.cssText = `
                    position: fixed;
                    pointer-events: none;
                    opacity: 0.7;
                    z-index: 10000;
                    width: ${rect.width}px;
                    height: ${rect.height}px;
                    box-shadow: 0 4px 20px rgba(99, 102, 241, 0.5);
                    border: 2px solid #6366f1;
                    transform: scale(0.95);
                `;
                document.body.appendChild(newClone);
                return newClone;
            };

            const createPlaceholder = () => {
                const ph = editorDoc.createElement('div');
                ph.className = 'drag-placeholder';
                ph.innerHTML = '📍 Drop here';
                ph.style.cssText = `
                    border: 3px dashed #6366f1;
                    background: rgba(99, 102, 241, 0.1);
                    min-height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #6366f1;
                    font-weight: bold;
                    margin: 10px 0;
                    border-radius: 8px;
                `;
                return ph;
            };

            const findInsertionPoint = (y) => {
                const elements = Array.from(editorBody.querySelectorAll('p, div, h1, h2, h3, h4, h5, h6, img, video, iframe, blockquote, pre, ul, ol, table'));
                let closest = null;
                let closestDistance = Infinity;
                let insertBefore = true;

                elements.forEach(el => {
                    if (el === placeholder || el === draggedElement || el.contains(draggedElement)) return;

                    const rect = el.getBoundingClientRect();
                    const midY = rect.top + rect.height / 2;
                    const distance = Math.abs(y - midY);

                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closest = el;
                        insertBefore = y < midY;
                    }
                });

                return { element: closest, before: insertBefore };
            };

            editorBody.addEventListener('mousedown', function (e) {
                const target = e.target;

                if (target.tagName === 'IMG' || target.tagName === 'VIDEO' || target.tagName === 'IFRAME') {
                    e.preventDefault();
                    e.stopPropagation();

                    isDragging = true;
                    draggedElement = target;

                    const rect = target.getBoundingClientRect();
                    offsetX = e.clientX - rect.left;
                    offsetY = e.clientY - rect.top;

                    clone = createClone(target);
                    clone.style.left = (e.clientX - offsetX) + 'px';
                    clone.style.top = (e.clientY - offsetY) + 'px';

                    placeholder = createPlaceholder();
                    target.parentNode.insertBefore(placeholder, target.nextSibling);

                    target.style.opacity = '0.3';
                    editorDoc.body.style.userSelect = 'none';
                }
            }, true);

            editorDoc.addEventListener('mousemove', function (e) {
                if (!isDragging || !draggedElement || !clone) return;

                e.preventDefault();

                clone.style.left = (e.clientX - offsetX) + 'px';
                clone.style.top = (e.clientY - offsetY) + 'px';

                const insertion = findInsertionPoint(e.clientY);
                if (insertion.element && placeholder) {
                    if (insertion.before) {
                        insertion.element.parentNode.insertBefore(placeholder, insertion.element);
                    } else {
                        insertion.element.parentNode.insertBefore(placeholder, insertion.element.nextSibling);
                    }
                }
            });

            editorDoc.addEventListener('mouseup', function () {
                if (!isDragging || !draggedElement) return;

                if (placeholder && placeholder.parentNode) {
                    placeholder.parentNode.insertBefore(draggedElement, placeholder);
                    placeholder.parentNode.removeChild(placeholder);
                }

                draggedElement.style.opacity = '';

                if (clone && clone.parentNode) {
                    clone.parentNode.removeChild(clone);
                }

                isDragging = false;
                draggedElement = null;
                placeholder = null;
                clone = null;
                editorDoc.body.style.userSelect = '';

                editor.undoManager.add();
                editor.fire('change');
            });

            editorDoc.addEventListener('mouseleave', function () {
                if (isDragging && draggedElement) {
                    draggedElement.style.opacity = '';

                    if (clone && clone.parentNode) {
                        clone.parentNode.removeChild(clone);
                    }
                    if (placeholder && placeholder.parentNode) {
                        placeholder.parentNode.removeChild(placeholder);
                    }

                    isDragging = false;
                    draggedElement = null;
                    placeholder = null;
                    clone = null;
                    editorDoc.body.style.userSelect = '';
                }
            });

            const addMediaCursor = () => {
                const mediaElements = editorBody.querySelectorAll('img, video, iframe');
                mediaElements.forEach(el => {
                    el.style.cursor = 'grab';
                    if (!el.title) {
                        el.title = 'Drag to move';
                    }
                });
            };

            addMediaCursor();
            editor.on('NodeChange SetContent', () => {
                addMediaCursor();
                enforceLtr();
            });
        });

        editor.on('keydown', enforceLtr);
        editor.on('input', enforceLtr);
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
                    // 'directionality', // RTL/LTR text (disabled to prevent RTL typing)
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

                // IMAGE SETTINGS
                images_upload_handler: images_upload_handler,
                automatic_uploads: true,
                paste_data_images: true,
                images_reuse_filename: true,
                image_caption: true,
                image_advtab: true,
                image_title: true,
                image_description: true,
                image_dimensions: true,
                image_uploadtab: true,
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

                // TABLE SETTINGS
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
                table_grid: true,
                table_use_colgroups: true,
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

                // Content styling
                content_style: `
                    html {
                        direction: ltr !important;
                        unicode-bidi: normal !important;
                    }
                    body { 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                        font-size: 16px; 
                        line-height: 1.6;
                        color: #e0e0e0;
                        background-color: #1a1a2e;
                        padding: 20px;
                        direction: ltr !important;
                        text-align: left !important;
                        unicode-bidi: normal !important;
                    }
                    p, h1, h2, h3, h4, h5, h6, div, span, li, td, th {
                        direction: ltr !important;
                        text-align: left;
                        unicode-bidi: normal !important;
                    }
                    img { 
                        max-width: 100%; 
                        height: auto; 
                        display: block; 
                        margin: 10px 0; 
                    }
                    img.img-left { 
                        float: left; 
                        margin-right: 20px; 
                        margin-bottom: 10px; 
                    }
                    img.img-center { 
                        display: block; 
                        margin: 20px auto; 
                    }
                    img.img-right { 
                        float: right; 
                        margin-left: 20px; 
                        margin-bottom: 10px; 
                    }
                    img.img-full { 
                        width: 100%; 
                    }
                    img.img-small { 
                        max-width: 200px; 
                    }
                    img.img-medium { 
                        max-width: 400px; 
                    }
                    img.img-large { 
                        max-width: 800px; 
                    }
                    video, iframe { 
                        max-width: 100%; 
                        display: block; 
                        margin: 20px auto; 
                    }
                    table { 
                        border-collapse: collapse; 
                        width: 100%; 
                        margin: 20px 0; 
                    }
                    th, td { 
                        border: 1px solid #444; 
                        padding: 12px; 
                    }
                    th { 
                        background: #2a2a4a; 
                        font-weight: bold; 
                    }
                    table.table-bordered { 
                        border: 2px solid #6366f1; 
                    }
                    table.table-striped tr:nth-child(even) { 
                        background: #1f1f3a; 
                    }
                    table.table-hover tr:hover { 
                        background: #2a2a4a; 
                    }
                    table.table-compact td, table.table-compact th { 
                        padding: 6px; 
                    }
                    pre { 
                        background: #0d0d1a; 
                        padding: 15px; 
                        border-radius: 8px; 
                        overflow-x: auto; 
                    }
                    code { 
                        background: #0d0d1a; 
                        padding: 2px 6px; 
                        border-radius: 4px; 
                    }
                    blockquote { 
                        border-left: 4px solid #6366f1; 
                        padding-left: 20px; 
                        margin-left: 0; 
                        color: #a0a0a0; 
                    }
                    a { 
                        color: #6366f1; 
                        text-decoration: none; 
                    }
                    a:hover { 
                        text-decoration: underline; 
                    }
                `,

                // Other settings
                directionality: 'ltr',
                text_direction: 'ltr',
                forced_root_block_attrs: { dir: 'ltr' },
                autosave_interval: '30s',
                autosave_prefix: 'tinymce-autosave-',
                autosave_restore_when_empty: true,
                resize: true,
                min_height: 500,
                block_formats: 'Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Heading 5=h5; Heading 6=h6; Preformatted=pre; Blockquote=blockquote',
                font_family_formats: 'Arial=arial,helvetica,sans-serif; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Tahoma=tahoma,arial,helvetica,sans-serif; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Roboto=roboto; Open Sans=open sans',
                font_size_formats: '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt 72pt',
                promotion: false,
                branding: false,
                extended_valid_elements: 'img[class|src|border|alt|title|width|height|style|align],video[class|src|controls|width|height|poster|autoplay|loop|muted|style],iframe[src|width|height|frameborder|allowfullscreen|style],a[href|target|title|class|style|rel]',
                object_resizing: true,
                resize_img_proportional: true,
            }}
            onEditorChange={onEditorChange}
        />
    );
};

export default RichTextEditor;



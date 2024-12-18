import { QuillModule } from 'ngx-quill';
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ImagePreviewPipe } from './image-preview.pipe';

@Component({
  selector: 'app-create-ticket',
  imports: [QuillModule, CommonModule, ImagePreviewPipe],
  templateUrl: './create-ticket.component.html',
  styleUrl: './create-ticket.component.css',
})
export class CreateTicketComponent implements OnInit {
  addForm!: FormGroup;

  imagePreview: string | ArrayBuffer | null = null;

  editorModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'link', 'strike'], // toggled buttons
      ['blockquote', 'code-block'],

      [{ header: [7, 1, 2, 3, 4, 5, 6] }], // custom button values
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
      [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
      [{ direction: 'rtl' }],
      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ align: [] }],
      ['clean'],
    ],
  };

  constructor(private fb: FormBuilder) {}

  onUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.addForm.patchValue({ image: file });
      this.addForm.get('image')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result; // Store the dataURL in imagePreview
      };
      reader.readAsDataURL(file); // Convert file to dataURL
    }
  }

  ngOnInit(): void {
    this.addForm = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(4)]],
      status: ['PENDING'],
      description: [null],
      assigned_to: [null, [Validators.required]],
      image: [null],
    });
  }

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  file: File | null = null;

  // Handle file selection
  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const selectedFile = target.files ? target.files[0] : null;
    if (selectedFile && selectedFile.type.startsWith('image')) {
      this.file = selectedFile;
    }
  }

  // Handle drag-and-drop
  onDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer?.files) {
      const droppedFile = event.dataTransfer.files[0];
      if (droppedFile.type.startsWith('image')) {
        this.file = droppedFile;
      }
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  // Handle paste event
  @HostListener('window:paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    const items = event.clipboardData?.items;
    if (items) {
      const imageFiles = Array.from(items)
        .filter((item) => item.type.startsWith('image'))
        .map((item) => item.getAsFile())
        .filter((file) => file) as File[];

      if (imageFiles.length > 0) {
        this.file = imageFiles[0]; // Take the first image file, since it's single file input
      }
    }
  }

  // Remove the file
  removeFile(): void {
    this.file = null;
  }
}

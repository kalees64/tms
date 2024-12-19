import { QuillModule } from 'ngx-quill';
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ImagePreviewPipe } from './image-preview.pipe';
import { USER } from '../dashboard/dashboard.component';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { CREATE_TICKET, TicketService } from '../../services/ticket.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-ticket',
  imports: [QuillModule, CommonModule, ImagePreviewPipe, ReactiveFormsModule],
  templateUrl: './create-ticket.component.html',
  styleUrl: './create-ticket.component.css',
})
export class CreateTicketComponent implements OnInit {
  addForm!: FormGroup;

  usersIT!: USER[];

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

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private ticketService: TicketService,
    private toast: ToastrService
  ) {}

  async ngOnInit(): Promise<void> {
    this.addForm = this.fb.group({
      title: [null, [Validators.required, Validators.minLength(4)]],
      status: ['OPEN'],
      description: [null],
      assignedTo: [null, [Validators.required]],
    });

    const res = await this.userService.getUsers();

    this.usersIT = res.data.filter(
      (user: USER) => user.profiles[0].profileName === 'it_team'
    );
  }

  get title() {
    return this.addForm.controls['title'];
  }

  get assignedTo() {
    return this.addForm.controls['assignedTo'];
  }

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

  async onCreate() {
    console.log(this.addForm.value);

    try {
      const user = await this.userService.getUserFromLocalStorage();

      const newTicket: CREATE_TICKET = {
        ...this.addForm.value,
        createdBy: user.id,
        modifiedBy: user.id,
        assignedAt: new Date().toISOString(),
        image: this.imagePreview,
      };

      console.log(newTicket);

      const res = await this.ticketService.createTicket(newTicket);

      if (res.data) {
        this.toast.success('Ticket created successfully');
        this.router.navigateByUrl('/dashboard');
      }
    } catch (error) {
      console.log(error);
    }
  }

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  file: File | null = null;

  // Handle file selection
  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      this.file = target.files[0];

      // Generate preview
      const reader = new FileReader();
      reader.onload = () => (this.imagePreview = reader.result);
      reader.readAsDataURL(this.file);
    }
  }

  // Handle drag-and-drop
  onDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer?.files[0]) {
      this.file = event.dataTransfer.files[0];

      const reader = new FileReader();
      reader.onload = () => (this.imagePreview = reader.result);
      reader.readAsDataURL(this.file);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  // Handle paste event
  @HostListener('window:paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    const items = event.clipboardData?.items || [];
    for (let item of items) {
      if (item.type.startsWith('image')) {
        const file = item.getAsFile();
        if (file) {
          this.file = file;

          const reader = new FileReader();
          reader.onload = () => (this.imagePreview = reader.result);
          reader.readAsDataURL(this.file);
        }
      }
    }
  }

  // Remove the file
  removeFile(): void {
    this.file = null;
    this.imagePreview = null;
  }
}

import { Component, OnInit, Input, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { QuestionService } from 'src/app/Services/question.service';
import { RfcsService } from 'src/app/Services/rfcs.service';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { take, filter, tap } from 'rxjs/operators';
import { FadeAnimation } from 'src/app/Animations/fadeAnim';
import { EventEmitter } from 'events';
import { IRFC } from 'src/app/Models/rfc';

@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.scss'],
  animations: [
    FadeAnimation.fadeInMS(300)
  ]
})
export class FormBuilderComponent implements OnInit {

  @Input() docId: string;
  @Input() rfc: IRFC;
  @Output() finishedJob = new EventEmitter();
  register: FormGroup;
  result$: Observable<any>;
  form: any = [];

  constructor(
    private firestore: AngularFirestore,
    private questionService: QuestionService,
    private snackBar: ToastController,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    if (this.docId == null) {
      return;
    }
    const ticketRef = this.firestore.collection('Tickets').doc(this.docId);
    // Firestore observable, dismiss loader when data is available
    this.result$ = ticketRef.valueChanges()
      .pipe(
        filter(data => !!data),
        tap((data) => {
          console.log(data);
          this.register = this.questionService.toForm(data);
          Object.keys(data).forEach(element => {
            this.form.push({
              name: element,
              value: data[element]
            });
            this.register.get(element).setValue(data[element]);
          });
          this.loadingCtrl.dismiss();
        })
      );
  }

  acceptTicket() {
    if (this.register.valid === true) {
      let ticketData = {};
      this.form.forEach(element => {
        ticketData[element.name] = this.register.get(element.name).value;
      });
      const resultForm = { rfc: this.rfc, ...ticketData };
      this.firestore.collection('Tickets').doc(this.docId).update(resultForm).then(() => {
        this.snackBar.create({
          message: "Success",
          color: "light",
          duration: 1000
        }).then((data) => {
          data.present();
        });
        this.finishedJob.emit('');
      });
    }
  }

}

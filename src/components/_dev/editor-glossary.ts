import { Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { DevActions } from '../../actions/actions';
import { ToastController } from 'ionic-angular';

export interface glossaryTerm {
  term: string,
  definition: string,
  slug: string
}

@Component({
  selector: 'dev-editor-glossary',
  templateUrl: 'editor-glossary.html'
})

export class DevEditorGlossaryComponent {
  allGlossaryTerms: any = []
  status: string = 'Ready'

  constructor(private db: AngularFirestore, private devActions: DevActions, private toast: ToastController) {
    this.db.collection('glossary').valueChanges().subscribe(
      res => {
        this.allGlossaryTerms = res;
        console.log('allGlossaryTerms', res)
      })
  }

  save() {
    this.status='pending'
    console.log('all terms', this.allGlossaryTerms)
    let patch: any = {}
    let terms = {}
    let promises = []
    this.allGlossaryTerms.slice(0).forEach(term => {
      term.slug = term.term.toLowerCase().split(' ').join("-")
      terms[term.slug] = term
      let ref = this.db.collection('glossary').doc(term.slug).set(term)
      promises.push(ref)
    })
    Promise.all(promises).then(
      res => {
        console.log('promise res', res)
        this.status = 'ready'
            this.devActions.toggleEditMode(false)
            this.toast.create({
              message: 'Changes saved successfully',
              duration:2000
            }).present()
            let timestamp = Date.now()
            this.db.collection('backups').doc<any>('glossary-'+timestamp).set(terms)
      },
      err=>{console.error(err);this.status='ready'}
    ).catch(err=>{
      console.error(err);this.status='ready'
    })
    console.log('db terms', terms)
  }

  addTerm() {
    console.log('adding question')
    this.allGlossaryTerms.push({
      term: "",
      definition: "",
      slug: "",
    })
    console.log('glossary terms', this.allGlossaryTerms)
  }

  deleteTerm(i, term: glossaryTerm) {
    try {
      this.db.collection('glossary').doc(term.slug).delete().then(
        res => this.allGlossaryTerms.splice(i, 1)
      )
    } catch (error) {
      console.error(error)
      // catch empty doc remove
      this.allGlossaryTerms.splice(i, 1)
    }

  }

}

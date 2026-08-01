import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-mission',
  imports: [RouterModule],
  templateUrl: './mission.html',
  styleUrl: './mission.css',
})
export class Mission {

  // Return to the previous page
  goBack() {
    window.history.back();
  }

}
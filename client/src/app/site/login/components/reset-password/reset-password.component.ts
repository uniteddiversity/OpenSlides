import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { environment } from 'environments/environment';
import { HttpService } from 'app/core/core-services/http.service';
import { ThemeService } from 'app/core/ui-services/theme.service';
import { BaseViewComponent } from 'app/site/base/base-view';

/**
 * Reset password component.
 *
 */
@Component({
    selector: 'os-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['../../assets/reset-password-pages.scss']
})
export class ResetPasswordComponent extends BaseViewComponent implements OnInit {
    /**
     * THis form holds one control for the email.
     */
    public resetPasswordForm: FormGroup;

    /**
     * Constructur for the reset password view. Initializes the form for the email.
     */
    public constructor(
        titleService: Title,
        translate: TranslateService,
        matSnackBar: MatSnackBar,
        private http: HttpService,
        formBuilder: FormBuilder,
        private router: Router,
        private themeService: ThemeService
    ) {
        super(titleService, translate, matSnackBar);
        this.resetPasswordForm = formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    /**
     * sets the title of the page
     */
    public ngOnInit(): void {
        super.setTitle('Reset password');
        this.themeService.checkTheme();
    }

    /**
     * Do the password reset.
     */
    public async resetPassword(): Promise<void> {
        if (this.resetPasswordForm.invalid) {
            return;
        }

        try {
            await this.http.post<void>(environment.urlPrefix + '/users/reset-password/', {
                email: this.resetPasswordForm.get('email').value
            });
            this.matSnackBar.open(
                this.translate.instant('An email with a password reset link was send!'),
                this.translate.instant('OK'),
                {
                    duration: 0
                }
            );
            this.router.navigate(['/login']);
        } catch (e) {
            this.raiseError(e);
        }
    }
}

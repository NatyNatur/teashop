import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniLoaderComponent } from './mini-loader.component';

describe('MiniLoaderComponent', () => {
  let component: MiniLoaderComponent;
  let fixture: ComponentFixture<MiniLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiniLoaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiniLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

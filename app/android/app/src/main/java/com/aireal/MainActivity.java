package com.aireal;

import android.content.Intent;
import android.os.Bundle;
import android.os.PersistableBundle;

import androidx.annotation.Nullable;

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

  @Override
  public void onCreate(@Nullable Bundle savedInstanceState, @Nullable PersistableBundle persistentState) {
    setTheme(R.style.AppTheme);
    super.onCreate(savedInstanceState, persistentState);


  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "aireal";
  }
}

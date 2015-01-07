package com.adarkroom;

import java.util.HashMap;
import java.util.Map;

import com.badlogic.gdx.ApplicationListener;
import com.badlogic.Gdx;
import com.badlogic.gdx.InputProcessor;
import com.badlogic.gdx.graphics.Color
import com.badlogic.gdx.graphics.GL10
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.graphics.g2d.BitmapFont.TextBounds
import com.badlogic.gdx.graphics.g2d.SpriteBatch;

	public class InputDemo2 implements ApplicationListener, InputProcessor {
	private SpriteBatch Batch;
	private BitmapFont 	font;
	private String message = "Touch something already!";
	private int w,h;
	
class TouchInfo {
	public float touchX = 0
	public float touchY = 0
	public boolean touched = false;
}

private Map<Integer, TouchInfo> touches = new HashMap<Interger, TouchInfo>();

@Override
public void create() {
	batch = new SpriteBatch();
	font  = new BitmapFont(Gdx.files.internal("data/arial-15.fnt"),false);
	font.setColor(.RED);
	w = Gdx.graphics.getWidth()	
	w = Gdx.graphics.getWidth();
        h = Gdx.graphics.getHeight();
        Gdx.input.setInputProcessor(this);
        for(int i = 0; i < 5; i++){
            touches.put(i, new TouchInfo());
        }
    }

    @Override
    public void dispose() {
        batch.dispose();
        font.dispose();
    }

    @Override
    public void render() {        
        Gdx.gl.glClearColor(1, 1, 1, 1);
        Gdx.gl.glClear(GL10.GL_COLOR_BUFFER_BIT);
        
        batch.begin();
        
        message = "";
        for(int i = 0; i < 5; i++){
            if(touches.get(i).touched)
                message += "Finger:" + Integer.toString(i) + "touch at:" +
                        Float.toString(touches.get(i).touchX) +
                        "," +
                        Float.toString(touches.get(i).touchY) +
                        "\n";
                                
        }
        TextBounds tb = font.getBounds(message);
        float x = w/2 - tb.width/2;
        float y = h/2 + tb.height/2;
        font.drawMultiLine(batch, message, x, y);
        
        batch.end();
    }

    @Override
    public void resize(int width, int height) {
    }

    @Override
    public void pause() {
    }

    @Override
    public void resume() {
    }

    @Override
    public boolean keyDown(int keycode) {
        // TODO Auto-generated method stub
        return false;
    }

    @Override
    public boolean keyUp(int keycode) {
        // TODO Auto-generated method stub
        return false;
    }

    @Override
    public boolean keyTyped(char character) {
        // TODO Auto-generated method stub
        return false;
    }

    @Override
    public boolean touchDown(int screenX, int screenY, int pointer, int button) {
        if(pointer < 5){
            touches.get(pointer).touchX = screenX;
            touches.get(pointer).touchY = screenY;
            touches.get(pointer).touched = true;
        }
        return true;
    }

    @Override
    public boolean touchUp(int screenX, int screenY, int pointer, int button) {
        if(pointer < 5){
            touches.get(pointer).touchX = 0;
            touches.get(pointer).touchY = 0;
            touches.get(pointer).touched = false;
        }
        return true;
    }

    @Override
    public boolean touchDragged(int screenX, int screenY, int pointer) {
        // TODO Auto-generated method stub
        return false;
    }

    @Override
    public boolean mouseMoved(int screenX, int screenY) {
        // TODO Auto-generated method stub
        return false;
    }

    @Override
    public boolean scrolled(int amount) {
        // TODO Auto-generated method stub
        return false;
    }
}
package com.adarkroom;


import com.badlogic.gdx.ApplicationListener;
import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.GL10;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.graphics.g2d.BitmapFont.TextBounds;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.input.GestureDetector;
import com.badlogic.gdx.input.GestureDetector.GestureListener;
import com.badlogic.gdx.math.Vector2;

public class InputDemo3 implements ApplicationListener, GestureListener {
    private SpriteBatch batch;
    private BitmapFont font;
    private String message = "No gesture performed yet";
    private int w,h;

    
    @Override
    public void create() {        
        batch = new SpriteBatch();    
        font = new BitmapFont(Gdx.files.internal("data/arial-15.fnt"),false);
        font.setColor(Color.RED);
        w = Gdx.graphics.getWidth();
        h = Gdx.graphics.getHeight();
        
        GestureDetector gd = new GestureDetector(this);
        Gdx.input.setInputProcessor(gd);
    }

    @Override
    public void dispose() {
        batch.dispose();
        font.dispose();
    }

    @Override
    public void render() {        
        Gdx.gl.glClearColor(1, 1, 1, 1);
        Gdx.gl.glClear(GL10.GL_COLOR_BUFFER_BIT);
        
        batch.begin();
        
        TextBounds tb = font.getBounds(message);
        float x = w/2 - tb.width/2;
        float y = h/2 + tb.height/2;
        
        font.drawMultiLine(batch, message, x, y);
        
        batch.end();
    }

    @Override
    public void resize(int width, int height) {
    }

    @Override
    public void pause() {
    }

    @Override
    public void resume() {
    }

    @Override
    public boolean touchDown(float x, float y, int pointer, int button) {
        // TODO Auto-generated method stub
        return true;
    }

    @Override
    public boolean tap(float x, float y, int count, int button) {
        message = "Tap performed, finger" + Integer.toString(button);
        return true;
    }

    @Override
    public boolean longPress(float x, float y) {
        message = "Long press performed";
        return true;
    }

    @Override
    public boolean fling(float velocityX, float velocityY, int button) {
        message = "Fling performed, velocity:" + Float.toString(velocityX) +
                "," + Float.toString(velocityY);
        return true;
    }

    @Override
    public boolean pan(float x, float y, float deltaX, float deltaY) {
        message = "Pan performed, delta:" + Float.toString(deltaX) +
                "," + Float.toString(deltaY);
        return true;
    }

    @Override
    public boolean zoom(float initialDistance, float distance) {
        message = "Zoom performed, initial Distance:" + Float.toString(initialDistance) +
                " Distance: " + Float.toString(distance);
        return true;
    }

    @Override
    public boolean pinch(Vector2 initialPointer1, Vector2 initialPointer2,
            Vector2 pointer1, Vector2 pointer2) {
        message = "Pinch performed";
        return true;
    }

}
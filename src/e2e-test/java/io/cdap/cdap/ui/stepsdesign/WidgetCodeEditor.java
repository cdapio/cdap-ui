/*
 * Copyright © 2022 Cask Data, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

package io.cdap.cdap.ui.stepsdesign;

import io.cdap.cdap.ui.types.NodeInfo;
import io.cdap.cdap.ui.utils.Commands;
import io.cdap.cdap.ui.utils.Helper;
import io.cdap.e2e.pages.actions.CdfStudioActions;
import io.cdap.e2e.utils.ElementHelper;
import io.cdap.e2e.utils.SeleniumDriver;
import io.cucumber.java.en.Then;
import org.apache.commons.lang.StringUtils;
import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;

public class WidgetCodeEditor {
    private NodeInfo jSNode = new NodeInfo("JavaScript", "transform", "0");
    private static final String defaultJsEditorVal = "/**\n" +
            " * @summary Transforms the provided input record into zero or more output records or errors.\n" +
            "\n" +
            " * Input records are available in JavaScript code as JSON objects. \n" +
            "\n" +
            " * @param input an object that contains the input record as a JSON.   " +
            "e.g. to access a field called 'total' from the input record, use input.total.\n" +
            " * @param emitter an object that can be used to emit zero or more records " +
            "(using the emitter.emit() method) or errors (using the emitter.emitError() method) \n" +
            " * @param context an object that provides access to:\n" +
            " *            1. CDAP Metrics - context.getMetrics().count('output', 1);\n" +
            " *            2. CDAP Logs - context.getLogger().debug('Received a record');\n" +
            " *            3. Lookups - context.getLookup('blacklist').lookup(input.id); or\n" +
            " *            4. Runtime Arguments - context.getArguments().get('priceThreshold') \n" +
            " */ \n" +
            "function transform(input, emitter, context) {\n" +
            "  emitter.emit(input);\n" +
            "}";

    @Then("Add JS node to canvas")
    public void addJSNodeToCanvas() {
        Commands.addNodeToCanvas(jSNode);
    }

    @Then("Open JS node properties")
    public void openJSNodeProperties() {
        CdfStudioActions.navigateToPluginPropertiesPage(jSNode.getNodeName());
    }
    @Then("Get JS editor value and compare with default JS editor value")
    public void verifyDefaultJSEditorValue() {
        WebElement jsEditorElement = Helper.locateElementByCssSelector("div[class*='ace-editor-ref']");
        WebElement jsEditorContentElement = jsEditorElement.findElement(
                By.cssSelector("div[class*='ace_text-layer']"));
        String editorValue = ElementHelper.getElementText(jsEditorContentElement);
        Assert.assertEquals(StringUtils.normalizeSpace(editorValue),
                StringUtils.normalizeSpace(defaultJsEditorVal));
    }

    @Then("Replace and verify JS editor value and cursor position")
    public void replaceJSEditorValueAndVerifyCursor() {
        WebElement jsEditorElement = Helper.locateElementByCssSelector("div[class*='ace-editor-ref']");
        JavascriptExecutor jsExecutor = (JavascriptExecutor) SeleniumDriver.getDriver();
        jsExecutor.executeScript("ace.edit(arguments[0]).gotoLine(15)", jsEditorElement);
        jsExecutor.executeScript("ace.edit(arguments[0]).session.doc" +
                ".replace({start: {row: 14, column: 0},end: {row: 14, column: 30}}, 'console.log(\"newcode\");')",
                jsEditorElement);

        WebElement jsEditorContentElement = jsEditorElement.findElement(
                By.cssSelector("div[class*='ace_text-layer']"));
        String editorValue = ElementHelper.getElementText(jsEditorContentElement);
        Assert.assertTrue(editorValue.contains("console.log(\"newcode\");"));

        String rowPosition = jsExecutor.executeScript(
                "return ace.edit(arguments[0]).getCursorPosition().row;", jsEditorElement).toString();
        String columnPosition = jsExecutor.executeScript(
                "return ace.edit(arguments[0]).getCursorPosition().column;", jsEditorElement).toString();
        Assert.assertEquals("14", rowPosition);
        Assert.assertEquals("23", columnPosition);
    }
}

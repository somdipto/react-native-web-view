import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  theme?: 'light' | 'dark';
  height?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = 'javascript',
  theme = 'light',
  height = '100%'
}) => {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    
    // Configure editor options
    editor.updateOptions({
      fontSize: 14,
      fontFamily: 'Fira Code, Monaco, Menlo, monospace',
      lineNumbers: 'on',
      roundedSelection: false,
      scrollBeyondLastLine: false,
      readOnly: false,
      cursorStyle: 'line',
      automaticLayout: true,
      minimap: { enabled: true },
      wordWrap: 'on',
      formatOnPaste: true,
      formatOnType: true,
      tabSize: 2,
      insertSpaces: true,
      folding: true,
      foldingStrategy: 'indentation',
      showFoldingControls: 'always',
      bracketPairColorization: { enabled: true },
      guides: {
        bracketPairs: true,
        indentation: true,
        highlightActiveIndentation: true
      }
    });

    // Set up React Native and JavaScript language features
    if (monaco?.languages?.typescript?.javascriptDefaults) {
      monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2020,
        allowNonTsExtensions: true,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        module: monaco.languages.typescript.ModuleKind.CommonJS,
        noEmit: true,
        typeRoots: ['node_modules/@types']
      });

      // Add React Native specific type definitions
      monaco.languages.typescript.javascriptDefaults.addExtraLib(
        `
        declare module 'react-native' {
          export const View: any;
          export const Text: any;
          export const StyleSheet: any;
          export const TouchableOpacity: any;
          export const ScrollView: any;
          export const Image: any;
          export const TextInput: any;
          export const Button: any;
          export const Alert: any;
          export const Dimensions: any;
          export const Platform: any;
          export const StatusBar: any;
          export const SafeAreaView: any;
          export const FlatList: any;
          export const SectionList: any;
          export const Modal: any;
          export const ActivityIndicator: any;
          export const Switch: any;
          export const Slider: any;
          export const Picker: any;
          export const DatePickerIOS: any;
          export const ProgressBarAndroid: any;
          export const ProgressViewIOS: any;
          export const RefreshControl: any;
          export const WebView: any;
          export const NavigatorIOS: any;
          export const TabBarIOS: any;
          export const SegmentedControlIOS: any;
        }
        `,
        'react-native.d.ts'
      );
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value);
    }
  };

  return (
    <div className="h-full w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-sm font-medium text-gray-700">App.js</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">React Native</span>
          <div className="w-2 h-2 rounded-full bg-green-400"></div>
        </div>
      </div>
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        theme={theme === 'dark' ? 'vs-dark' : 'vs'}
        options={{
          selectOnLineNumbers: true,
          roundedSelection: false,
          readOnly: false,
          cursorStyle: 'line',
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;